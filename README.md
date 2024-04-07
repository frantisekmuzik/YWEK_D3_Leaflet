# Propojení JS knihoven [D3](https://d3js.org/) a [Leaflet](https://leafletjs.com/)

Při práci ve VS Code je nutné nainstalovat extension Live Sever

## Jednotlivé kroky jsou rozděleny do samostatných commitů pro případné hledání chyb:
### [0) Připojení souborů s mapou (Leaflet) a grafem (D3)](https://github.com/frantisekmuzik/YWEK_D3_Leaflet/commit/fc7b26e26c99d16835b72308b229987619705c76)
- do stejné složky vložit soubory pro vykreslení mapy a grafu

Výstupy obou stránek: 

![](/img/obr1.png)

### [1) Vytvoření samostatného souboru pro leaflet script](https://github.com/frantisekmuzik/YWEK_D3_Leaflet/commit/b9152db8489e91dc972cea80db682740ff2130b7)
- do nového souboru se překopíruje skript vytvářející mapu v *index_geoJSON.html*
- reference na vytvořený JS skript v body html

### [2) Přidání grafu k mapě](https://github.com/frantisekmuzik/YWEK_D3_Leaflet/commit/2a9164334042fc3d3c575f0b92ec5d813b123837)
- překopírování kódu pro vykreslení grafu z *D3_YWEK_kod.html* do *index_geoJSON.html*

### 3) Uspořádání UI stránky