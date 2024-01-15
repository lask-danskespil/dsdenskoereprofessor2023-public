export enum ELockframe {
  Lock = "LockLockframe",
  Unlock = "UnlockLockframe",
  FullyUnlocked = "FullyUnlockedLockframe"
}

export enum EEventQueue {
  Add = "AddEventQueue",
  Flush = "FlushEventQueue"
}

export enum EFullscreen {
  IsFullscreen = "IsFullscreen",
  IsNormal = "IsNormal",
  Unsupported = "UnsupportedFullscreen"
}

export enum EAutoButton {
  Enable = "EnableAutoButton",
  Disable = "DisableAutoButton",
  StartAuto = "StartAutoButton",
  StopAuto = "StopAutoButton"
}

export enum EBetEvents {
  confirmBet = "confirmBet",
  resumeGame = "resumeGame",
  replayGame = "replayGame",
  cancelledBet = "cancelledBet"
}
