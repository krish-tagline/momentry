import WidgetKit
import SwiftUI

struct Provider: TimelineProvider {
    let appGroupIdentifier = "group.com.memontry.widget"
    let userDefaultsKey = "widgetQuote"
    
    func placeholder(in context: Context) -> SimpleEntry {
        SimpleEntry(date: Date(), text: "Welcome to memontry!")
    }

    func getSnapshot(in context: Context, completion: @escaping (SimpleEntry) -> ()) {
        let text = getStoredText()
        let entry = SimpleEntry(date: Date(), text: text)
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<Entry>) -> ()) {
        let text = getStoredText()
        let entry = SimpleEntry(date: Date(), text: text)
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }
    
    private func getStoredText() -> String {
        guard let sharedDefaults = UserDefaults(suiteName: appGroupIdentifier) else {
            return "Welcome to memontry!"
        }
        return sharedDefaults.string(forKey: userDefaultsKey) ?? "Welcome to memontry!"
    }
}

struct SimpleEntry: TimelineEntry {
    let date: Date
    let text: String
}

struct memontryWidgetEntryView : View {
    var entry: Provider.Entry

    var body: some View {
        ZStack {
            Color.white
            Text(entry.text)
                .padding()
                .multilineTextAlignment(.center)
                .font(.body)
                .foregroundColor(.black)
        }
    }
}

@main
struct memontryWidget: Widget {
    let kind: String = "memontryWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            if #available(iOS 17.0, *) {
                memontryWidgetEntryView(entry: entry)
                    .containerBackground(.fill.tertiary, for: .widget)
            } else {
                memontryWidgetEntryView(entry: entry)
                    .padding()
                    .background(Color.white)
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
            memontryWidgetEntryView(entry: SimpleEntry(date: Date(), text: "Welcome to memontry!"))
                .previewContext(WidgetPreviewContext(family: .systemSmall))
            memontryWidgetEntryView(entry: SimpleEntry(date: Date(), text: "Welcome to memontry!"))
                .previewContext(WidgetPreviewContext(family: .systemMedium))
        }
    }
}
