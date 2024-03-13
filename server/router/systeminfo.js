import os from 'os';
import { exec } from 'child_process';

export function getSystemInfo(req, res) {
  const cpu_count = os.cpus().length;
  const cpuLoad = (os.loadavg()[0] / cpu_count) * 100;
  const totalMem = os.totalmem();
  const totalMemInGB = (totalMem / (1024 ** 3));
  const freeMem = os.freemem();
  const usedMem = totalMem - freeMem;
  const usedMemPercentage = (usedMem / totalMem) * 100;
  const uptime = os.uptime();
  const hours = Math.floor(uptime / 3600);
  const minutes = Math.floor((uptime % 3600) / 60);
  const seconds = uptime % 60;
  const hostname = os.hostname();
  const osType = os.type();
  const osRelease = os.release();

  let diskUsageCommand;

  if (process.platform === "win32") {
    // 윈도우용 디스크 사용량 체크 명령
    diskUsageCommand = 'wmic logicaldisk get size,freespace,caption';
  } else {
    diskUsageCommand = 'df -h';
  }
  exec(diskUsageCommand, (err, stdout, stderr) => {
    if (err) {
      return res.status(500).send('Error fetching disk usage');
    }

    res.json({
      cpuLoad: cpuLoad.toFixed(2),
      memory: {
        totalPercentage: totalMemInGB.toFixed(),
        usedPercentage: usedMemPercentage.toFixed(2)
      },
      diskUsage: stdout,
      uptime: {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      },
      hostname,
      osType,
      osRelease
    });
  });
}