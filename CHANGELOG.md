
# Change Log

## [1.1.38] - 2023-08-12
  
 
### Added
  - Added a new `PixelJob` module, which purpose is to handle the job of placing pixels given a buffer.
  - Added `setUA` function to `Auth`.
  - Added `CHAT_SEND_MESSAGE`, `SERVER_TIME` and `USERNAME` packet.

### Changed
  - The system for protection and placing pixels has been reworked.
  - `Auth` module now calls `performPing` every 4.5 minutes.
  - `Bot.placePixel` now returns the amount of time to wait till the next pixel placement.
  - Changed pixel interval from `20ms` to `25ms`.
  - Minor changes to the `Connection` timers.
  - Anti Aliasing is now disabled by default when scaling images.



  
### Fixed
  - Fixed issue of WebSocket reconnection stuck in a `403` loop