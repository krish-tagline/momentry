import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    let appGroupIdentifier = "group.com.memontry.widget"
    let eventNameKey = "widgetEventName"
    let daysLeftKey = "widgetDaysLeft"
    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), eventName: "No active countdown", daysLeft: "-")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let (name, days) = getStoredData()
        let entry = SimpleEntry(date: Date(), eventName: name, daysLeft: days)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let (name, days) = getStoredData()
        let entry = SimpleEntry(date: Date(), eventName: name, daysLeft: days)
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
    
    private func getStoredData() -> (String, String) {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            return ("No active countdown", "-")
        }
        let name = sharedDefaults.string(forKey: eventNameKey) ?? "No active countdown"
        let days = sharedDefaults.string(forKey: daysLeftKey) ?? "-"
        return (name, days)
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let eventName: String
    let daysLeft: String
}

struct memontryWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            // Background texture
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    Circle()
                        .fill(Color.white.opacity(0.1))
                        .frame(width: 100, height: 100)
                        .offset(x: 40, y: 40)
                }
            }
            
            VStack(spacing: 10) {
                Text(entry.eventName.uppercased())
                    .font(.system(size: 13, weight: .bold, design: .rounded))
                    .foregroundColor(.white.opacity(0.9))
                    .multilineTextAlignment(.center)
                    .lineLimit(1)
                    .padding(.horizontal, 4)
                    .minimumScaleFactor(0.7)
                
                VStack(spacing: 6) {
                    Text(entry.daysLeft)
                        .font(.system(size: 44, weight: .black, design: .rounded))
                        .foregroundColor(.white)
                        .shadow(color: Color.black.opacity(0.2), radius: 4, x: 0, y: 2)
                        .lineLimit(1)
                        .minimumScaleFactor(0.7)
                    
                    Text("DAYS REMAINING")
                        .font(.system(size: 10, weight: .heavy, design: .rounded))
                        .foregroundColor(.white.opacity(0.8))
                        .kerning(1.0)
                        .multilineTextAlignment(.center)
                        .fixedSize(horizontal: false, vertical: true)
                }
            }
            .padding(.vertical, 16)
            .padding(.horizontal, 8)
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity)
        .background(
            LinearGradient(
                gradient: Gradient(colors: [Color(hex: "7C3AED"), Color(hex: "5B21B6")]),
                startPoint: .topLeading,
                endPoint: .bottomTrailing
            )
        )
    }
}

extension Color {
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (1, 1, 1, 0)
        }

        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue:  Double(b) / 255,
            opacity: Double(a) / 255
        )
    }
}

@main
struct memontryWidget: Widget {
    let kind: String = "memontryWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                memontryWidgetEntryView(entry: entry)
                    .containerBackground(for: .widget) {
                        ZStack {
                            LinearGradient(
                                gradient: Gradient(colors: [Color(hex: "7C3AED"), Color(hex: "5B21B6")]),
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                            
                            // Background texture
                            VStack {
                                Spacer()
                                HStack {
                                    Spacer()
                                    Circle()
                                        .fill(Color.white.opacity(0.1))
                                        .frame(width: 100, height: 100)
                                        .offset(x: 40, y: 40)
                                }
                            }
                        }
                    }
            } else {
                memontryWidgetEntryView(entry: entry)
            }
        }
        .configurationDisplayName("memontry Widget")
        .description("Display a dynamic quote from the app.")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}

struct memontryWidget_Previews: PreviewProvider {
    static var previews: some View {
        Group {
            memontryWidgetEntryView(entry: SimpleEntry(date: Date(), eventName: "Exam Day", daysLeft: "12"))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
            memontryWidgetEntryView(entry: SimpleEntry(date: Date(), eventName: "Grandpa Birthday", daysLeft: "34"))
                .previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
