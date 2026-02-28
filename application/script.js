async function loadInfo() {
    const res = await fetch("/api/info");
    const data = await res.json();

    document.getElementById("info").innerText =
        `Hostname: ${data.hostname}
CPUs: ${data.cpus}
Load Avg: ${data.loadavg.join(", ")}
Uptime: ${Math.floor(data.uptime)} sec`;
}

loadInfo();