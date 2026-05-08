#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(WidgetBridge, NSObject)

RCT_EXTERN_METHOD(updateWidget:(NSString *)eventName daysLeft:(NSString *)daysLeft eventId:(NSString *)eventId)

@end
