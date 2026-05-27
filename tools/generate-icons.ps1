Add-Type -AssemblyName System.Drawing

$iconDirectory = Join-Path $PSScriptRoot "..\src\icons"
[System.IO.Directory]::CreateDirectory($iconDirectory) | Out-Null

function New-RoundedRectanglePath {
    param(
        [float]$X,
        [float]$Y,
        [float]$Width,
        [float]$Height,
        [float]$Radius
    )

    $path = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $diameter = $Radius * 2
    $path.AddArc($X, $Y, $diameter, $diameter, 180, 90)
    $path.AddArc($X + $Width - $diameter, $Y, $diameter, $diameter, 270, 90)
    $path.AddArc($X + $Width - $diameter, $Y + $Height - $diameter, $diameter, $diameter, 0, 90)
    $path.AddArc($X, $Y + $Height - $diameter, $diameter, $diameter, 90, 90)
    $path.CloseFigure()
    return $path
}

function New-Point {
    param([float]$X, [float]$Y)
    return [System.Drawing.PointF]::new($X, $Y)
}

foreach ($size in @(16, 32, 48, 128)) {
    $scale = $size / 128.0
    $bitmap = [System.Drawing.Bitmap]::new($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

    $backgroundPath = New-RoundedRectanglePath -X (4 * $scale) -Y (4 * $scale) -Width (120 * $scale) -Height (120 * $scale) -Radius (25 * $scale)
    $backgroundBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 36, 71, 161))
    $graphics.FillPath($backgroundBrush, $backgroundPath)

    $shadowBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 20, 43, 111))
    $shadowPath = New-RoundedRectanglePath -X (17 * $scale) -Y (63 * $scale) -Width (71 * $scale) -Height (37 * $scale) -Radius (10 * $scale)
    $graphics.FillPath($shadowBrush, $shadowPath)

    $keyBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 244, 247, 255))
    $keyPath = New-RoundedRectanglePath -X (17 * $scale) -Y (50 * $scale) -Width (71 * $scale) -Height (42 * $scale) -Radius (10 * $scale)
    $graphics.FillPath($keyBrush, $keyPath)

    $textBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 36, 71, 161))
    $font = [System.Drawing.Font]::new("Arial", [float](25 * $scale), [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $format = [System.Drawing.StringFormat]::new()
    $format.Alignment = [System.Drawing.StringAlignment]::Center
    $format.LineAlignment = [System.Drawing.StringAlignment]::Center
    $letter = [string][char]0x042D
    $graphics.DrawString($letter, $font, $textBrush, [System.Drawing.RectangleF]::new(17 * $scale, 51 * $scale, 51 * $scale, 40 * $scale), $format)

    $handBrush = [System.Drawing.SolidBrush]::new([System.Drawing.Color]::FromArgb(255, 255, 198, 112))
    $handOutline = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 179, 100, 44), [float](3.2 * $scale))
    $handOutline.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round
    $handPath = [System.Drawing.Drawing2D.GraphicsPath]::new()
    $handPath.AddBezier(
        (New-Point (50 * $scale) (107 * $scale)),
        (New-Point (48 * $scale) (99 * $scale)),
        (New-Point (52 * $scale) (89 * $scale)),
        (New-Point (62 * $scale) (88 * $scale))
    )
    $handPath.AddLine((New-Point (62 * $scale) (88 * $scale)), (New-Point (72 * $scale) (88 * $scale)))
    $handPath.AddLine((New-Point (72 * $scale) (88 * $scale)), (New-Point (72 * $scale) (42 * $scale)))
    $handPath.AddBezier(
        (New-Point (72 * $scale) (42 * $scale)),
        (New-Point (72 * $scale) (34 * $scale)),
        (New-Point (84 * $scale) (34 * $scale)),
        (New-Point (84 * $scale) (42 * $scale))
    )
    $handPath.AddLine((New-Point (84 * $scale) (42 * $scale)), (New-Point (84 * $scale) (62 * $scale)))
    $handPath.AddBezier(
        (New-Point (84 * $scale) (62 * $scale)),
        (New-Point (85 * $scale) (55 * $scale)),
        (New-Point (96 * $scale) (56 * $scale)),
        (New-Point (96 * $scale) (64 * $scale))
    )
    $handPath.AddLine((New-Point (96 * $scale) (64 * $scale)), (New-Point (96 * $scale) (73 * $scale)))
    $handPath.AddBezier(
        (New-Point (96 * $scale) (73 * $scale)),
        (New-Point (97 * $scale) (67 * $scale)),
        (New-Point (107 * $scale) (68 * $scale)),
        (New-Point (107 * $scale) (76 * $scale))
    )
    $handPath.AddLine((New-Point (107 * $scale) (76 * $scale)), (New-Point (107 * $scale) (91 * $scale)))
    $handPath.AddBezier(
        (New-Point (107 * $scale) (91 * $scale)),
        (New-Point (107 * $scale) (105 * $scale)),
        (New-Point (96 * $scale) (112 * $scale)),
        (New-Point (82 * $scale) (112 * $scale))
    )
    $handPath.AddLine((New-Point (82 * $scale) (112 * $scale)), (New-Point (66 * $scale) (112 * $scale)))
    $handPath.CloseFigure()
    $graphics.FillPath($handBrush, $handPath)
    $graphics.DrawPath($handOutline, $handPath)

    $pressPen = [System.Drawing.Pen]::new([System.Drawing.Color]::FromArgb(255, 255, 208, 70), [float](4 * $scale))
    $pressPen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pressPen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $graphics.DrawLine($pressPen, 67 * $scale, 31 * $scale, 62 * $scale, 25 * $scale)
    $graphics.DrawLine($pressPen, 76 * $scale, 28 * $scale, 76 * $scale, 20 * $scale)
    $graphics.DrawLine($pressPen, 85 * $scale, 31 * $scale, 90 * $scale, 25 * $scale)

    $filePath = Join-Path $iconDirectory "icon$size.png"
    $bitmap.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)

    $pressPen.Dispose()
    $handPath.Dispose()
    $handOutline.Dispose()
    $handBrush.Dispose()
    $format.Dispose()
    $font.Dispose()
    $textBrush.Dispose()
    $keyPath.Dispose()
    $keyBrush.Dispose()
    $shadowPath.Dispose()
    $shadowBrush.Dispose()
    $backgroundBrush.Dispose()
    $backgroundPath.Dispose()
    $graphics.Dispose()
    $bitmap.Dispose()
}
