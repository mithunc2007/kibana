/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License
 * 2.0; you may not use this file except in compliance with the Elastic License
 * 2.0.
 */

import { ElasticsearchClient, SavedObjectsClientContract } from '../../../../../../src/core/server';
import { elasticsearchServiceMock } from '../../../../../../src/core/server/mocks';
import { mlServicesMock } from '../../lib/machine_learning/mocks';
import {
  getMockJobSummaryResponse,
  getMockListModulesResponse,
  getMockRulesResponse,
} from './detections.mocks';
import { fetchDetectionsUsage } from './index';

describe('Detections Usage', () => {
  describe('fetchDetectionsUsage()', () => {
    let esClientMock: jest.Mocked<ElasticsearchClient>;
    let savedObjectsClientMock: jest.Mocked<SavedObjectsClientContract>;
    let mlMock: ReturnType<typeof mlServicesMock.create>;

    beforeEach(() => {
      esClientMock = elasticsearchServiceMock.createClusterClient().asInternalUser;
      mlMock = mlServicesMock.create();
    });

    it('returns zeroed counts if both calls are empty', async () => {
      const result = await fetchDetectionsUsage('', esClientMock, mlMock, savedObjectsClientMock);

      expect(result).toEqual({
        detection_rules: {
          custom: {
            enabled: 0,
            disabled: 0,
          },
          elastic: {
            enabled: 0,
            disabled: 0,
          },
        },
        ml_jobs: {
          custom: {
            enabled: 0,
            disabled: 0,
          },
          elastic: {
            enabled: 0,
            disabled: 0,
          },
        },
      });
    });

    it('tallies rules data given rules results', async () => {
      (esClientMock.search as jest.Mock).mockResolvedValue({ body: getMockRulesResponse() });

      const result = await fetchDetectionsUsage('', esClientMock, mlMock, savedObjectsClientMock);

      expect(result).toEqual(
        expect.objectContaining({
          detection_rules: {
            custom: {
              enabled: 1,
              disabled: 1,
            },
            elastic: {
              enabled: 2,
              disabled: 3,
            },
          },
        })
      );
    });

    it('tallies jobs data given jobs results', async () => {
      const mockJobSummary = jest.fn().mockResolvedValue(getMockJobSummaryResponse());
      const mockListModules = jest.fn().mockResolvedValue(getMockListModulesResponse());
      mlMock.modulesProvider.mockReturnValue(({
        listModules: mockListModules,
      } as unknown) as ReturnType<typeof mlMock.modulesProvider>);
      mlMock.jobServiceProvider.mockReturnValue({
        jobsSummary: mockJobSummary,
      });

      const result = await fetchDetectionsUsage('', esClientMock, mlMock, savedObjectsClientMock);

      expect(result).toEqual(
        expect.objectContaining({
          ml_jobs: {
            custom: {
              enabled: 1,
              disabled: 1,
            },
            elastic: {
              enabled: 1,
              disabled: 1,
            },
          },
        })
      );
    });
  });
});
