import {defineConfig} from '@playwright/test';

const chromePath=process.env.CHROME_PATH||(process.platform==='win32'?'C:/Program Files/Google/Chrome/Application/chrome.exe':undefined);

export default defineConfig({
 testDir:'./tests/e2e',
 fullyParallel:false,
 workers:1,
 timeout:30000,
 webServer:{command:'npm run preview',url:'http://localhost:3000/en/',reuseExistingServer:true,timeout:15000},
 use:{
  baseURL:'http://localhost:3000',
  headless:true,
  launchOptions:chromePath?{executablePath:chromePath}:undefined,
  trace:'retain-on-failure',
  screenshot:'only-on-failure',
 },
 reporter:[['list'],['html',{open:'never'}]],
});
