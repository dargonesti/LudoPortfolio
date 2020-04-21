### Watches folder C:\tmp\inImages and converts jpg dropped in it to webP of 60% quality and 50% size in C:\tmp\outImages

### Needs webp converter from : https://developers.google.com/speed/webp/docs/cwebp
### Download URL : https://storage.googleapis.com/downloads.webmproject.org/releases/webp/index.html

#ligne optionelle sur certains systèmes?
add-type -assemblyname system.drawing

###Prints files already in InFolder
Get-ChildItem -Recurse c:\tmp\inImages -Filter *.jpg | % {
    $image = [System.Drawing.Image]::FromFile($_.FullName)
     
	$h = $image.Height
	$w = $image.Width
	Write-Host "Image size : $h x $w "
}
 


### SET FOLDER TO WATCH + FILES TO WATCH + SUBFOLDERS YES/NO
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = "C:\tmp\inImages"
    $watcher.Filter = "*.jpg"
    $watcher.IncludeSubdirectories = $true
    $watcher.EnableRaisingEvents = $true  

### DEFINE ACTIONS AFTER AN EVENT IS DETECTED
    $actionLog = { $path = $Event.SourceEventArgs.FullPath
                $changeType = $Event.SourceEventArgs.ChangeType
                $logline = "$(Get-Date), $changeType, $path"
                Add-content ".\log.txt" -value $logline
              }   
    $actionConvert = { 
				try{
					$path = $Event.SourceEventArgs.FullPath 
					$fileName = ($Event.SourceEventArgs.Name).Split(".")[0]
					Write-Host "Converting file, name is : $fileName"
					
					$image = [System.Drawing.Image]::FromFile($path)    
					$sizeDivider = 1					
					$h = $image.Height/$sizeDivider
					$w = $image.Width/$sizeDivider
					Write-Host "Image size : $h x $w "
					
					#cwebp.exe -q 60 -resize $w $h $path -o C:\tmp\outImages\$fileName.webp
					.\libwebp\bin\cwebp.exe -q 60 -resize $w $h $path -o C:\tmp\outImages\$fileName.webp
				}
				catch {
					Write-Host $Error[0]
				}
              }   			  
### DECIDE WHICH EVENTS SHOULD BE WATCHED 
###    Register-ObjectEvent $watcher "Created" -Action $actionLog 
###    Register-ObjectEvent $watcher "Deleted" -Action $actionLog 	
    Register-ObjectEvent $watcher "Created" -Action $actionConvert
    while ($true) {sleep 5}