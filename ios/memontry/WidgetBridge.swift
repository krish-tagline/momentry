import Foundation
import React
import WidgetKit

@objc(WidgetBridge)
class WidgetBridge: NSObject {
  
  @objc
  static func requiresMainQueueSetup() -> Bool {
    return true
  }
  
  private let appGroupIdentifier = "group.com.memontry.widget"
  private let eventNameKey = "widgetEventName"
  private let daysLeftKey = "widgetDaysLeft"
  
  @objc
  func updateWidget(_ eventName: String, daysLeft: String) {
    if let sharedDefaults = UserDefaults(suiteName: appGroupIdentifier) {
      sharedDefaults.set(eventName, forKey: eventNameKey)
      sharedDefaults.set(daysLeft, forKey: daysLeftKey)
      sharedDefaults.synchronize()
      
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
