package com.memontry

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.widget.RemoteViews

class QuoteWidget : AppWidgetProvider() {

    companion object {
        private const val PREFS_NAME = "QuoteWidgetPrefs"
        private const val PREF_PREFIX_KEY = "quote_widget_"
        private const val KEY_EVENT_NAME = "event_name"
        private const val KEY_DAYS_LEFT = "days_left"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val eventName = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_EVENT_NAME, "No active countdown")
            val daysLeft = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_DAYS_LEFT, "-")

            val views = RemoteViews(context.packageName, R.layout.widget_quote)
            views.setTextViewText(R.id.widget_event_name, eventName)
            views.setTextViewText(R.id.widget_days_left, daysLeft)

            val intent = Intent(context, MainActivity::class.java).apply {
                flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
            }
            
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun saveEventAndUpdateWidgets(context: Context, eventName: String, daysLeft: String) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

            val widgetManager = AppWidgetManager.getInstance(context)
            val componentName = android.content.ComponentName(context, QuoteWidget::class.java)
            val appWidgetIds = widgetManager.getAppWidgetIds(componentName)

            for (appWidgetId in appWidgetIds) {
                prefs.edit().apply {
                    putString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_EVENT_NAME, eventName)
                    putString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_DAYS_LEFT, daysLeft)
                    apply()
                }
                updateAppWidget(context, widgetManager, appWidgetId)
            }
        }
    }

    override fun onUpdate(
        context: Context,
        appWidgetManager: AppWidgetManager,
        appWidgetIds: IntArray
    ) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        val editor = prefs.edit()
        for (appWidgetId in appWidgetIds) {
            editor.remove(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_EVENT_NAME)
            editor.remove(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_DAYS_LEFT)
        }
        editor.apply()
    }
}
