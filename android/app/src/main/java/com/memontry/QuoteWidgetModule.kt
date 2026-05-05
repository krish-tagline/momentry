package com.memontry

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod

class QuoteWidgetModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "QuoteWidget"
    }

    @ReactMethod
    fun updateQuote(text: String) {
        val context = reactApplicationContext
        QuoteWidget.saveQuoteAndUpdateWidgets(context, text)
    }
}
