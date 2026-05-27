Add-Type -AssemblyName System.Drawing
Add-Type -AssemblyName System.IO.Compression.FileSystem

$projectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$sourceDirectory = Join-Path $projectRoot "src"
$templateScreenshot = Join-Path $projectRoot "template\template screenshot.png"
$releaseDirectory = Join-Path $projectRoot "release\chrome-web-store"
$releaseZip = Join-Path $releaseDirectory "layout-guard-2.0.9.zip"
$storeIcon = Join-Path $releaseDirectory "icon-128.png"
$storeScreenshot = Join-Path $releaseDirectory "screenshot-640x400.png"

[System.IO.Directory]::CreateDirectory($releaseDirectory) | Out-Null

[System.IO.File]::Copy((Join-Path $sourceDirectory "icons\icon128.png"), $storeIcon, $true)

$sourceImage = [System.Drawing.Image]::FromFile($templateScreenshot)
try {
    $sourceCropHeight = [Math]::Floor($sourceImage.Width * 400 / 640)
    if ($sourceImage.Width -lt 640 -or $sourceImage.Height -lt $sourceCropHeight) {
        throw "Template screenshot is too small for the required 640x400 crop."
    }

    $outputImage = [System.Drawing.Bitmap]::new(640, 400, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    try {
        $graphics = [System.Drawing.Graphics]::FromImage($outputImage)
        try {
            $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
            $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
            $graphics.DrawImage(
                $sourceImage,
                [System.Drawing.Rectangle]::new(0, 0, 640, 400),
                [System.Drawing.Rectangle]::new(0, 0, $sourceImage.Width, $sourceCropHeight),
                [System.Drawing.GraphicsUnit]::Pixel
            )
        } finally {
            $graphics.Dispose()
        }
        $outputImage.Save($storeScreenshot, [System.Drawing.Imaging.ImageFormat]::Png)
    } finally {
        $outputImage.Dispose()
    }
} finally {
    $sourceImage.Dispose()
}

if ([System.IO.File]::Exists($releaseZip)) {
    [System.IO.File]::Delete($releaseZip)
}
[System.IO.Compression.ZipFile]::CreateFromDirectory(
    $sourceDirectory,
    $releaseZip,
    [System.IO.Compression.CompressionLevel]::Optimal,
    $false
)

$iconImage = [System.Drawing.Image]::FromFile($storeIcon)
try {
    if ($iconImage.Width -ne 128 -or $iconImage.Height -ne 128) {
        throw "Store icon must be exactly 128x128 pixels."
    }
} finally {
    $iconImage.Dispose()
}

$screenshotImage = [System.Drawing.Image]::FromFile($storeScreenshot)
try {
    if ($screenshotImage.Width -ne 640 -or $screenshotImage.Height -ne 400) {
        throw "Store screenshot must be exactly 640x400 pixels."
    }
    if ($screenshotImage.PixelFormat -ne [System.Drawing.Imaging.PixelFormat]::Format24bppRgb) {
        throw "Store screenshot must be a 24-bit RGB PNG without alpha."
    }
} finally {
    $screenshotImage.Dispose()
}

$archive = [System.IO.Compression.ZipFile]::OpenRead($releaseZip)
try {
    $entryNames = @($archive.Entries | ForEach-Object { $_.FullName })
    if ($entryNames -notcontains "manifest.json") {
        throw "Release ZIP must contain manifest.json at its root."
    }
    if ($entryNames | Where-Object { $_ -match '^(release|template|tools)/' }) {
        throw "Release ZIP contains files outside the extension source directory."
    }
} finally {
    $archive.Dispose()
}

Write-Output "Created $releaseZip"
Write-Output "Created $storeIcon"
Write-Output "Created $storeScreenshot"
Write-Output "Verified store icon, screenshot and extension ZIP."
