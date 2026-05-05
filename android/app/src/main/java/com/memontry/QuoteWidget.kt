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
        private const val KEY_QUOTE = "quote"

        fun updateAppWidget(
            context: Context,
            appWidgetManager: AppWidgetManager,
            appWidgetId: Int
        ) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
            val quote = prefs.getString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_QUOTE, "Welcome to memontry!")

            val views = RemoteViews(context.packageName, R.layout.widget_quote)
            views.setTextViewText(R.id.widget_quote_text, quote)

            val intent = Intent(context, MainActivity::class.java)
            val pendingIntent = PendingIntent.getActivity(
                context,
                0,
                intent,
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_IMMUTABLE
            )
            views.setOnClickPendingIntent(R.id.widget_root, pendingIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        }

        fun saveQuoteAndUpdateWidgets(context: Context, quote: String) {
            val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

            val widgetManager = AppWidgetManager.getInstance(context)
            val componentName = android.content.ComponentName(context, QuoteWidget::class.java)
            val appWidgetIds = widgetManager.getAppWidgetIds(componentName)

            for (appWidgetId in appWidgetIds) {
                prefs.edit().putString(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_QUOTE, quote).apply()
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
            editor.remove(PREF_PREFIX_KEY + appWidgetId + "_" + KEY_QUOTE)
        }
        editor.apply()
    }
}
