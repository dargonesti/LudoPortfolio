
@ECHO OFF
echo "PowerShell.exe -Command ""& './addWatermarks.ps1'"

echo ""
echo "Vous devez avoir ImageMagick d'installé pour convertir vos images!"
echo "Vous pouvez le trouver à : "
echo "https://imagemagick.org/script/download.php"
echo "Changez le fichier watermark.png pour afficher un watermark différent sur les images jpeg."
echo "From : https://www.imagemagick.org/discourse-server/viewtopic.php?f=1&t=22379#p93454"

echo "";
read -p "Quelle qualité de compression voulez vous pour les images? (33-100%, aucune réponse pour 100%) : " compress;


cd
list=`find F://tmp/in -type d`
for directory in $list; do
cd $directory
mogrify -format jpg -matte \
-draw 'gravity south image src-over 0,100 250,250 "./watermark.png"' *.jpg 
cd
done

PAUSE