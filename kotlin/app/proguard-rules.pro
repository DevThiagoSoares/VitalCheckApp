# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in the Android SDK tools.

# Room database entities
-keep class com.vitalcheck.app.data.local.** { *; }

# Domain entities (prevent obfuscation for debugging)
-keep class com.vitalcheck.app.domain.entity.** { *; }

