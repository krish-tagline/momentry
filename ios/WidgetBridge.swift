import Foundation
import React
import WidgetKit

@objc(WidgetBridge)
class WidgetBridge: NSObject {
  
  private let appGroupIdentifier = "group.com.memontry.widget"
  private let userDefaultsKey = "widgetQuote"
  
  @objc
  func sendTextToWidget(_ text: String) {
    if let sharedDefaults = UserDefaults(suiteName: appGroupIdentifier) {
      sharedDefaults.set(text, forKey: userDefaultsKey)
      sharedDefaults.synchronize()
      
      if #available(iOS 14.0, *) {
        WidgetCenter.shared.reloadAllTimelines()
      }
    }
  }
}
