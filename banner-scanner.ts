import {
  AndroidAgent,
  AndroidDevice,
  getConnectedDevices,
} from '@midscene/android';
import 'dotenv/config';

const sleep = (ms: number | undefined) => new Promise((r) => setTimeout(r, ms))
