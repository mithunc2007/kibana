/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

require('../../src/setup_node_env');

require('@kbn/test').runTestsCli([
  require.resolve('../test/functional/config.js'),
  require.resolve('../test/functional_basic/config.ts'),
  require.resolve('../test/security_solution_endpoint/config.ts'),
  require.resolve('../test/plugin_functional/config.ts'),
  require.resolve('../test/functional_with_es_ssl/config.ts'),
  require.resolve('../test/functional/config_security_basic.ts'),
  require.resolve('../test/security_functional/login_selector.config.ts'),
  require.resolve('../test/security_functional/oidc.config.ts'),
  require.resolve('../test/security_functional/saml.config.ts'),
  require.resolve('../test/api_integration/config_security_basic.ts'),
  require.resolve('../test/api_integration/config_security_trial.ts'),
  require.resolve('../test/api_integration/config.ts'),
  require.resolve('../test/api_integration_basic/config.ts'),
  require.resolve('../test/alerting_api_integration/basic/config.ts'),
  require.resolve('../test/alerting_api_integration/spaces_only/config.ts'),
  require.resolve('../test/alerting_api_integration/security_and_spaces/config.ts'),
  require.resolve('../test/case_api_integration/basic/config.ts'),
  require.resolve('../test/apm_api_integration/basic/config.ts'),
  require.resolve('../test/apm_api_integration/trial/config.ts'),
  require.resolve('../test/detection_engine_api_integration/security_and_spaces/config.ts'),
  require.resolve('../test/detection_engine_api_integration/basic/config.ts'),
  require.resolve('../test/lists_api_integration/security_and_spaces/config.ts'),
  require.resolve('../test/plugin_api_integration/config.ts'),
  require.resolve('../test/security_api_integration/saml.config.ts'),
  require.resolve('../test/security_api_integration/session_idle.config.ts'),
  require.resolve('../test/security_api_integration/session_lifespan.config.ts'),
  require.resolve('../test/security_api_integration/login_selector.config.ts'),
  require.resolve('../test/security_api_integration/audit.config.ts'),
  require.resolve('../test/security_api_integration/kerberos.config.ts'),
  require.resolve('../test/security_api_integration/kerberos_anonymous_access.config.ts'),
  require.resolve('../test/security_api_integration/pki.config.ts'),
  require.resolve('../test/security_api_integration/oidc.config.ts'),
  require.resolve('../test/security_api_integration/oidc_implicit_flow.config.ts'),
  require.resolve('../test/security_api_integration/token.config.ts'),
  require.resolve('../test/observability_api_integration/basic/config.ts'),
  require.resolve('../test/observability_api_integration/trial/config.ts'),
  require.resolve('../test/encrypted_saved_objects_api_integration/config'),
  require.resolve('../test/spaces_api_integration/spaces_only/config'),
  require.resolve('../test/spaces_api_integration/security_and_spaces/config_trial'),
  require.resolve('../test/spaces_api_integration/security_and_spaces/config_basic'),
  require.resolve('../test/saved_object_api_integration/security_and_spaces/config_trial'),
  require.resolve('../test/saved_object_api_integration/security_and_spaces/config_basic'),
  require.resolve('../test/saved_object_api_integration/security_only/config_trial'),
  require.resolve('../test/saved_object_api_integration/security_only/config_basic'),
  require.resolve('../test/saved_object_api_integration/spaces_only/config'),
  require.resolve('../test/ui_capabilities/security_and_spaces/config'),
  require.resolve('../test/ui_capabilities/security_only/config'),
  require.resolve('../test/ui_capabilities/spaces_only/config'),
  require.resolve('../test/upgrade_assistant_integration/config'),
  require.resolve('../test/licensing_plugin/config'),
  require.resolve('../test/licensing_plugin/config.public'),
  require.resolve('../test/endpoint_api_integration_no_ingest/config.ts'),
  require.resolve('../test/functional_embedded/config.ts'),
  require.resolve('../test/reporting_api_integration/reporting_and_security.config.ts'),
  require.resolve('../test/reporting_api_integration/reporting_without_security.config.ts'),
  require.resolve('../test/security_solution_endpoint_api_int/config.ts'),
  require.resolve('../test/ingest_manager_api_integration/config.ts'),
  require.resolve('../test/functional_enterprise_search/without_host_configured.config.ts'),
  require.resolve('../test/functional_vis_wizard/config.ts'),
  require.resolve('../test/saved_object_tagging/functional/config.ts'),
  require.resolve('../test/saved_object_tagging/api_integration/security_and_spaces/config.ts'),
  require.resolve('../test/saved_object_tagging/api_integration/tagging_api/config.ts'),
]);
