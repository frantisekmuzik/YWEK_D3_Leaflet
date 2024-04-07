type="module" // Typ skriptu = modul -> např. proměnné jsou pouze lokální

// Určení velikosti grafu (hodnoty v px)
const width = 640;
const height = 400;

// Určení okrajů grafu -> vypadá lépe vizuálně (hodnoty v px)
const marginTop = 20;
const marginRight = 20;
const marginBottom = 30;
const marginLeft = 60;

// Načtení dat z csv
const data = d3.csv("cr_data_hdp.csv").then( function(data) {
    const parseRok = d3.timeParse("%Y");
    data.forEach(d => { 
        d.datum = parseRok(d.datum); // Převedení datumu z textu do formátu pro datum
        d.hodnota = +d.hodnota; // Převedení hodnoty z textu do čísla
    });

// Výpis dat do konzole
console.log(data)

// Vytvoření osy X
const x = d3.scaleUtc()
    .domain(d3.extent(data, d => d.datum)) // Datový rozsah osy - nastavení automaticky dle dat
    .range([marginLeft, width - marginRight]); // Pixelový rozsah osy  

// Vytvoření osy Y
const y = d3.scaleLinear()
    .domain(d3.extent(data, d => d.hodnota)) // Nastavení rozsahu automaticky dle dat
    .range([height - marginBottom, marginTop]);

// Vytvoření SVG, do kterého se graf vykreslí
const svg = d3.create("svg") // Vytvoření prvku s názvem svg -> ten následně voláme při jeho editaci
    .attr("width", width) // Určení šířky SVG
    .attr("height", height); // Určení výšky SVG

// Vložení osy X do SVG
svg.append("g")
    .attr("transform", `translate(0,${height - marginBottom})`) // Určení pozice osy X vůči SVG
    .call(d3.axisBottom(x)); 

// Vložení osy Y do SVG
svg.append("g")
    .attr("transform", `translate(${marginLeft},0)`)
    .call(d3.axisLeft(y));

// Vytvoření linie, která bude vykreslena
const linie = d3.line()
    .x( d => x(d.datum)) // Datum -> na ose X
    .y( d => y(d.hodnota)); // Hodnota -> na ose Y

// Vykreslení linie do SVG    
svg.append("path") 
    .datum(data) // Načtení dat k vykreslení; vykreslení dle zadaného pořadí
    .attr("fill","none") // Barva výplně vykresleného obrazce
    .attr("stroke","steelblue") // Barva vykreslené linie
    .attr("stroke-width", 3) // Tloušťka linie
    .style("stroke-dasharray", ("10,3")) // Čárkovaná linie, vzor čárkování určen číselně (čára, mezera)
    .attr("d", linie);

// Vykreslení indikátoru zobrazujícího vybranu hodnotu grafu    
const circle = svg.append("circle")
    .attr("fill", "steelblue") // Výplň
    .style("stroke", "white") // Ohraničení
    .attr("opacity", .70); // Průhlednost
      
// Vytvoření listening rectangle, který bude číst data z celého grafu; propojení se stylem v html    
const listeningRect = svg.append("rect")
    .attr("width", width)
    .attr("height", height);

// Vytvoření div pro zobrazení popupu    
const popup = d3.select("body")
    .append("div")
    .attr("class", "popup");

// Zvolení správných hodnot z grafu na základě pozice myši    
listeningRect.on("mousemove", function (event) {
    const [xCoord] = d3.pointer(event, this);
    const bisectDatum = d3.bisector(d => d.datum).left; // Nalezení nejbližšího bodu z grafu k pozici myši
    const x0 = x.invert(xCoord);
    const i = bisectDatum(data, x0, 1);
    const d0 = data[i - 1];
    const d1 = data[i];
    const d = x0 - d0.datum > d1.datum- x0 ? d1 : d0;
    const xPos = x(d.datum); // Do xPos se přiřadí vybraný datum (z načtených dat) na ose x
    const yPos = y(d.hodnota); // Do yPos se přiřadí vybraná hodnota (z načtených dat) na ose y

    // Aktualizování pozice kružnice na základě pozice myši
    circle.attr("cx", xPos)
        .attr("cy", yPos);

    // Nastavení poloměru kružnice
    circle.transition()
        .duration(50) // Rychlost změny poloměru kružnice na zobrazovaný poloměr
        .attr("r", 5); // Zobrazovaný poloměr

    // Vykreslení pop-upu 
    popup
    .style("display", "block")
    .style("left", `${xPos + 20}px`) // Offset popupu oproti pozici myši
    .style("top", `${yPos + 20}px`)
    .html(`<strong>Datum: </strong> ${d.datum.getFullYear()}<br><strong>HDP: </strong> ${d.hodnota.toLocaleString()} Kč`)
});

// Skrytí elementů při opuštění grafu myší
listeningRect.on("mouseleave", function () {
    // Skrytí kružnice
    circle.transition()
      .duration(50)
      .attr("r", 0);

    // Skrytí pop-upu  
    popup.style("display", "none");  
    
});

// Přidání titulku grafu
svg.append("text")
  .attr("class", "title")
  .attr("x", width / 2) // x-ová pozice 
  .attr("y", marginTop + 10) // y-ová pozice
  .style("font-size", "24px") // Velikost fontu
  .style("font-weight", "bold") // Typ fontu
  .style("font-family", "sans-serif") // Typ fontu
  .attr("text-anchor", "middle") // Vztažný bod
  .text("Vývoj HDP v České republice (v Kč)"); // Text nadpisu

// Přidání zdroje dat
svg.append("text")
  .attr("class", "source-credit")
  .attr("x", width/2)
  .attr("y", height)
  .style("font-size", "9px")
  .style("font-family", "sans-serif")
  .text("Zdroj: ČSÚ");  

// Vložení SVG do připraveného containeru v divu (okazujeme se před id definované v divu)
container.append(svg.node());

}) // Ukončení načítání dat