# Infrastructure / Equipment — CSPML Lab

## Equipment List

| Name | Description | Photo file |
|---|---|---|
| Software Defined Radio (SDR) | USRP B210 for real-time wireless prototyping | `images/infrastructure/sdr-usrp.jpg` |
| GPU Computing Workstation | NVIDIA GPU server for ML experiments | `images/infrastructure/gpu-server.jpg` |
| Spectrum Analyzer | Rohde & Schwarz FSW for RF measurements | `images/infrastructure/spectrum-analyzer.jpg` |
| Vector Signal Analyzer | For modulation analysis and demodulation testing | `images/infrastructure/vsa.jpg` |

---

## How to add equipment photos

1. Take a clear photo of the equipment (800×600 px recommended)
2. Save it to `images/infrastructure/` with a short name (e.g. `sdr-usrp.jpg`)
3. Open `index.html`, find `<!-- INFRASTRUCTURE SECTION -->`
4. Find the matching card — look for `<!-- EDIT: INFRA photo -->` comment
5. Replace `src="images/placeholder/equipment.svg"` with `src="images/infrastructure/sdr-usrp.jpg"`
