# Ottimizza le foto reali del cliente -> site/assets/img (webp, 2 larghezze)
from PIL import Image, ImageOps
import os, json
R='/config/work/super-speedy/research/'
O='/config/work/super-speedy/site/assets/img/'
os.makedirs(O,exist_ok=True)
S={
 'hero-food':('img-site/214587_SuperSpeedy_Hero-1920w-96e01b3e.webp',[800,1600]),
 'pizzaiolo-banco':('img-site/34.jpg',[800,1600]),
 'pizzaiolo':('img-site/4.jpg',[600,1100]),
 'impasto-farina':('img-site/3.jpg',[600,1100]),
 'impasto-stesura':('img-site/32.jpg',[600,1100]),
 'condimento':('img-site/28.jpg',[600,1100]),
 'banco-coppia':('img-site/33.jpg',[600,1100]),
 'forno':('img-site/PIZZERIA-SUPER-SPEEDY-Cagliari-021.jpg',[768]),
 'cartone':('img-site/31.jpg',[700,1400]),
 'margherita':('img-site/20.jpg',[600,1000]),
 'wurstel-fritte':('img-site/15.jpg',[600,1000]),
 'canadese':('img-site/19.jpg',[600,1000]),
 'formaggi':('img-site/25.jpg',[600,1000]),
 'sala-ampia':('img-site/sala_5-199c7e49.png',[800,1448]),
 'sala-murale':('img-site/sala_2.jpg',[700,1400]),
 'sala-banco':('img-site/sala_4-2ee81224.jpg',[700,1400]),
 'sala-cassa':('img-site/sala_3.jpg',[700,1400]),
 'focaccia-kebab':('img-site/214587_SuperSpeedy_Food_FocacciaKebab-1920w-7694c6c5.webp',[700,1400]),
 'burger':('img-site/214587_SuperSpeedy_Food_BigCheese-1920w-0bb83c25.webp',[700,1400]),
 'insalata':('img-site/214587_SuperSpeedy_Food_InsalatonaCapri-1920w-332ec7b1.webp',[700,1400]),
 'mozzarelline':('img-site/214587_SuperSpeedy_Food_MozzarellineFritte-1920w-4ec35985.webp',[700,1400]),
 'bufalina':('img-site/214587_SuperSpeedy_Food_Bufalina-1920w-adac3c83.webp',[700,1400]),
 'rucola-grana':('img-site/214587_SuperSpeedy_Food_RucolaGrana-1920w-521fb5dd.webp',[700,1400]),
 'dolce-smarties':('img-site/e0f36a33-dbce-4c38-b1ae-9ba8e2b5a184-943467b9.jpg',[600,1000]),
 'titolare':('img-ig/ig_04.jpg',[600]),
}
meta={}
for k,(src,ws) in S.items():
    im=ImageOps.exif_transpose(Image.open(R+src)).convert('RGB')
    meta[k]={'w':im.width,'h':im.height,'sizes':[]}
    for w in ws:
        w=min(w,im.width,1800)
        t=im.resize((w,round(im.height*w/im.width)),Image.LANCZOS)
        fn=f'{k}-{w}.webp'
        t.save(O+fn,'WEBP',quality=78,method=6)
        meta[k]['sizes'].append([w,t.height,fn])
# poster video = pizzaiolo al banco, 16:9
im=Image.open(R+'img-site/34.jpg').convert('RGB')
h=round(im.width*9/16); top=(im.height-h)//2
p=im.crop((0,top,im.width,top+h)).resize((1600,900),Image.LANCZOS)
os.makedirs('/config/work/super-speedy/site/assets/video',exist_ok=True)
p.save('/config/work/super-speedy/site/assets/video/poster.jpg',quality=82,optimize=True,progressive=True)
p.save('/config/work/super-speedy/site/assets/video/poster.webp',quality=78)
# logo + mascotte
L=Image.open(R+'img-site/LOGO_SUPER_SPEEDY_PIZZA_(3)-2-1.png')
L2=L.copy();L2.thumbnail((520,520));L2.save(O+'logo.png',optimize=True);L2.save(O+'logo.webp',quality=90)
m=L.crop((130,0,960,680));
m2=m.copy();m2.thumbnail((480,480));m2.save(O+'mascotte.webp',quality=90);m2.save(O+'mascotte.png',optimize=True)
sq=L.crop((280,0,960,680))
for s in (32,180,512):
    c=Image.new('RGBA',(680,680),(0,0,0,0));c.paste(sq,(0,0),sq)
    c.resize((s,s),Image.LANCZOS).save(O+f'favicon-{s}.png')
# og image
og=Image.open(R+'img-site/214587_SuperSpeedy_Hero-1920w-96e01b3e.webp').convert('RGB')
og=og.resize((1200,900)).crop((0,135,1200,765))
badge=Image.new('RGBA',(430,430),(255,246,230,255))
lg=L.copy();lg.thumbnail((380,380));badge.paste(lg,((430-lg.width)//2,(430-lg.height)//2),lg)
og.paste(badge,(60,100),badge)
og.save(O+'og.jpg',quality=84)
json.dump(meta,open(O+'meta.json','w'),indent=1)
print('ok',len(meta))
