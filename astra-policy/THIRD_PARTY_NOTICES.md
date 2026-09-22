# Licensing scope and third-party notices

The root MIT license applies to the report's own code, copy and documentation. It does not relicense third-party components, benchmark assets, model weights, fonts, logos or cited material.

- **JavaScript dependencies:** the site is built with React, ReactDOM and Vite; the exact resolution is in `_source/app/package-lock.json`. Their licenses (MIT) ship with the packages and are not vendored here.
- **Fonts:** the site bundles Latin subsets of Poppins under the SIL Open Font License 1.1; the notice is in `_source/app/src/assets/Poppins-OFL.txt`. Chinese text falls back to system fonts.
- **Galbot logo:** included for attribution only; Galbot retains all rights. Provenance is recorded in `_source/app/src/assets/galbot-wordmark-source.md`.
- **Benchmarks, policies and simulators:** RoboDojo, RoboLab, RoboCasa365, HumanoidBench, VLN-CE / ObjectNav datasets, π₀.₅, Humanoid-GPT, ScaleBFM, Passage, MuJoCo, Isaac Sim and the other systems named in the report are referenced under their own licenses; their assets and weights are not included. Published baseline numbers are quoted from the cited papers.
- **Rollout videos and figures:** recorded outputs of the described evaluation. Underlying benchmark scenes and third-party content remain subject to their original rights. The code license does not supersede those rights.
