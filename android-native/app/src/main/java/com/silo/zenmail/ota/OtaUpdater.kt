package com.silo.zenmail.ota

import android.app.DownloadManager
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageInstaller
import android.net.Uri
import android.os.Environment
import java.io.File
import java.io.FileInputStream

class OtaUpdater(private val context: Context) {

    private val downloadManager = context.getSystemService(Context.DOWNLOAD_SERVICE) as DownloadManager
    private var downloadId: Long = -1

    fun downloadAndInstallUpdate(url: String) {
        val destinationFile = File(
            context.getExternalFilesDir(Environment.DIRECTORY_DOWNLOADS),
            "zenmail-update.apk"
        )
        if (destinationFile.exists()) destinationFile.delete()

        val request = DownloadManager.Request(Uri.parse(url))
            .setTitle("Downloading ZenMail Update")
            .setDescription("Preparing high-performance workspace updates")
            .setNotificationVisibility(DownloadManager.Request.VISIBILITY_VISIBLE)
            .setDestinationUri(Uri.fromFile(destinationFile))

        context.registerReceiver(
            object : BroadcastReceiver() {
                override fun onReceive(c: Context?, intent: Intent?) {
                    val id = intent?.getLongExtra(DownloadManager.EXTRA_DOWNLOAD_ID, -1)
                    if (id == downloadId) {
                        installViaPackageInstaller(destinationFile)
                        context.unregisterReceiver(this)
                    }
                }
            },
            IntentFilter(DownloadManager.ACTION_DOWNLOAD_COMPLETE),
            Context.RECEIVER_EXPORTED
        )

        downloadId = downloadManager.enqueue(request)
    }

    private fun installViaPackageInstaller(apkFile: File) {
        val packageInstaller = context.packageManager.packageInstaller
        val params = PackageInstaller.SessionParams(PackageInstaller.SessionParams.MODE_FULL_INSTALL)
        
        try {
            val sessionId = packageInstaller.createSession(params)
            val session = packageInstaller.openSession(sessionId)
            
            FileInputStream(apkFile).use { inputStream ->
                session.openWrite("zenmail_install_session", 0, apkFile.length()).use { outputStream ->
                    inputStream.copyTo(outputStream)
                    session.fsync(outputStream)
                }
            }

            val intent = Intent(context, PackageInstallerStatusReceiver::class.java)
            val pendingIntent = android.app.PendingIntent.getBroadcast(
                context,
                101,
                intent,
                android.app.PendingIntent.FLAG_MUTABLE or android.app.PendingIntent.FLAG_UPDATE_CURRENT
            )
            
            session.commit(pendingIntent.intentSender)
            session.close()
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}

class PackageInstallerStatusReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        val status = intent.getIntExtra(PackageInstaller.EXTRA_STATUS, PackageInstaller.STATUS_FAILURE)
        if (status == PackageInstaller.STATUS_SUCCESS) {
            // App updated successfully
        } else {
            val message = intent.getStringExtra(PackageInstaller.EXTRA_STATUS_MESSAGE)
            // Handle failure
        }
    }
}
