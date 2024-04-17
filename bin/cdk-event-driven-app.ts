#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkEventDrivenAppStack } from '../lib/cdk-event-driven-app-stack';

const app = new cdk.App();
new CdkEventDrivenAppStack(app, 'Platform-X');
