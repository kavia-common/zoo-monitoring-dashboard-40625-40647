#!/bin/bash
cd /home/kavia/workspace/code-generation/zoo-monitoring-dashboard-40625-40647/zoo_monitoring_dashboard_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

