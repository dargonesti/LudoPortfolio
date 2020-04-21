#!/bin/bash

# Needs imagemagick, libjpeg-progs

echo ""
echo "Vous devez avoir ImageMagick d'installé pour convertir vos images!"
echo "Vous pouvez le trouver à : "
echo "https://imagemagick.org/script/download.php"
echo "changer le fichier watermark.png pour afficher un watermark différent sur les images jpeg."

while true; do
	echo "";
    echo "Les images TIFF dans le dossier actuel seront converties en Jpg et mises dans le conssier 'converted'..."
    read -p "Voulez vous continuer? (Oui || Non)" yn
    case $yn in
        [Oo]* )
			read -p "Quelle qualité de compression voulez vous pour les images? (33-100%, aucune réponse pour 100%) : " compress;

			find . -name "*.tiff" -print0 | \
				(while read -d $'\0' i; 
				do 
					folder=${i%/*};
					basename=${i%.*};
					mkdir -p "./converted/${folder}";
					echo "converting $i to ${basename}";
					
					if [ "$compress" -lt 100 ] && [ "$compress" -gt 32 ]; then
						convert -strip -interlace Plane -quality $compress "$i" "./converted/${basename}_${compress}.jpg";
					else 
						convert -strip -interlace Plane "$i" "./converted/${basename}.jpg";
						echo "Unknown value${compress}";
					fi
					
				done)

			if [ -f "../watermark.png" ]; then
				echo "Création d'un nouveau dossier pour images contenant les watermarks"
				
				read -p "Opacité du watermark? (1-100%, aucune réponse pour 100%) : " waterOpa;
				read -p "Dimension en % du watermark?" waterDim;
				read -p "Où voulez vous afficher la watermark? (défaut: centre, 1: droite-bas, 2: gauche-bas) : " waterPos;

				cd "converted"

				if [ "$waterOpa" -lt 1 ] && [ "$waterDim" -lt 1 ]; then 
					exit;;
				else
					find . -name "*.jpg" -print0 | \
						(while read -d $'\0' i; 
						do 
							folder=${i%/*};
							basename=${i%.*};
							mkdir -p "../withWatermark/${folder}";
							#echo "converting $i to ${basename}";
							
							"../ImageMagick/mogrify" -path "../withWatermark" -draw 'gravity Center image src-over 0,100 250,250 "../watermark.png"' "$i"
							#convert -strip -interlace Plane -quality $compress "$i" "./withWatermark/${basename}_${compress}.jpg";
							#convert -strip -interlace Plane "$i" "./withWatermark/${basename}.jpg";
							#echo "Unknown value${compress}";
							
						done)
				fi
			else
				echo "les watermarks n'ont pas été ajoutées"
			fi

			read -p "Press [Enter] pour quitter...";
			exit;;
        [Nn]* ) exit;;
        * ) echo "Svp répondez Oui ou Non.";;
    esac
done
