/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { NodesChangedAlert } from './nodes_changed_alert';
import { ALERT_NODES_CHANGED } from '../../common/constants';
import { fetchLegacyAlerts } from '../lib/alerts/fetch_legacy_alerts';
import { fetchClusters } from '../lib/alerts/fetch_clusters';

const RealDate = Date;

jest.mock('../lib/alerts/fetch_legacy_alerts', () => ({
  fetchLegacyAlerts: jest.fn(),
}));
jest.mock('../lib/alerts/fetch_clusters', () => ({
  fetchClusters: jest.fn(),
}));
jest.mock('moment', () => {
  return function () {
    return {
      format: () => 'THE_DATE',
    };
  };
});

jest.mock('../static_globals', () => ({
  Globals: {
    app: {
      getLogger: () => ({ debug: jest.fn() }),
      config: {
        ui: {
          ccs: { enabled: true },
          metricbeat: { index: 'metricbeat-*' },
          container: { elasticsearch: { enabled: false } },
        },
      },
    },
  },
}));

describe('NodesChangedAlert', () => {
  it('should have defaults', () => {
    const alert = new NodesChangedAlert();
    expect(alert.alertOptions.id).toBe(ALERT_NODES_CHANGED);
    expect(alert.alertOptions.name).toBe('Nodes changed');
    expect(alert.alertOptions.throttle).toBe('1d');
    expect(alert.alertOptions.actionVariables).toStrictEqual([
      { name: 'added', description: 'The list of nodes added to the cluster.' },
      { name: 'removed', description: 'The list of nodes removed from the cluster.' },
      { name: 'restarted', description: 'The list of nodes restarted in the cluster.' },
      {
        name: 'internalShortMessage',
        description: 'The short internal message generated by Elastic.',
      },
      {
        name: 'internalFullMessage',
        description: 'The full internal message generated by Elastic.',
      },
      { name: 'state', description: 'The current state of the alert.' },
      { name: 'clusterName', description: 'The cluster to which the nodes belong.' },
      { name: 'action', description: 'The recommended action for this alert.' },
      {
        name: 'actionPlain',
        description: 'The recommended action for this alert, without any markdown.',
      },
    ]);
  });

  describe('execute', () => {
    function FakeDate() {}
    FakeDate.prototype.valueOf = () => 1;

    const clusterUuid = 'abc123';
    const clusterName = 'testCluster';
    const legacyAlert = {
      prefix: 'Elasticsearch cluster nodes have changed!',
      message: 'Node was restarted [1]: [test].',
      metadata: {
        severity: 1000,
        cluster_uuid: clusterUuid,
      },
      nodes: {
        added: {},
        removed: {},
        restarted: {
          test: 'test',
        },
      },
    };

    const replaceState = jest.fn();
    const scheduleActions = jest.fn();
    const getState = jest.fn();
    const executorOptions = {
      services: {
        callCluster: jest.fn(),
        alertInstanceFactory: jest.fn().mockImplementation(() => {
          return {
            replaceState,
            scheduleActions,
            getState,
          };
        }),
      },
      state: {},
    };

    beforeEach(() => {
      // @ts-ignore
      Date = FakeDate;
      (fetchLegacyAlerts as jest.Mock).mockImplementation(() => {
        return [legacyAlert];
      });
      (fetchClusters as jest.Mock).mockImplementation(() => {
        return [{ clusterUuid, clusterName }];
      });
    });

    afterEach(() => {
      Date = RealDate;
      replaceState.mockReset();
      scheduleActions.mockReset();
      getState.mockReset();
    });

    it('should fire actions', async () => {
      const alert = new NodesChangedAlert();
      const type = alert.getAlertType();
      await type.executor({
        ...executorOptions,
        // @ts-ignore
        params: alert.alertOptions.defaultParams,
      } as any);
      expect(replaceState).toHaveBeenCalledWith({
        alertStates: [
          {
            cluster: { clusterUuid, clusterName },
            ccs: undefined,
            nodeName: 'Elasticsearch nodes alert',
            ui: {
              isFiring: true,
              message: {
                text: "Elasticsearch nodes 'test' restarted in this cluster.",
              },
              severity: 'warning',
              triggeredMS: 1,
              lastCheckedMS: 0,
            },
          },
        ],
      });
      expect(scheduleActions).toHaveBeenCalledWith('default', {
        action: '[View nodes](elasticsearch/nodes)',
        actionPlain: 'Verify that you added, removed, or restarted nodes.',
        internalFullMessage:
          'Nodes changed alert is firing for testCluster. The following Elasticsearch nodes have been added: removed: restarted:test. [View nodes](elasticsearch/nodes)',
        internalShortMessage:
          'Nodes changed alert is firing for testCluster. Verify that you added, removed, or restarted nodes.',
        added: '',
        removed: '',
        restarted: 'test',
        clusterName,
        state: 'firing',
      });
    });

    it('should not fire actions if there is no legacy alert', async () => {
      (fetchLegacyAlerts as jest.Mock).mockImplementation(() => {
        return [];
      });
      const alert = new NodesChangedAlert();
      const type = alert.getAlertType();
      await type.executor({
        ...executorOptions,
        // @ts-ignore
        params: alert.alertOptions.defaultParams,
      } as any);
      expect(replaceState).not.toHaveBeenCalledWith({});
      expect(scheduleActions).not.toHaveBeenCalled();
    });
  });
});
