const fs = require('fs');
const path = require('path');

// Función para aplanar el objeto de traducciones
function flattenObject(obj, prefix = '', result = []) {
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      
      if (typeof value === 'object' && !Array.isArray(value)) {
        // Es un objeto, seguir navegando
        flattenObject(value, prefix ? `${prefix}.${key}` : key, result);
      } else if (Array.isArray(value)) {
        // Es un array, convertir a string
        const pathStr = prefix ? `${prefix}.${key}` : key;
        result.push({ path: pathStr, value: JSON.stringify(value) });
      } else {
        // Es un valor primitivo
        const pathStr = prefix ? `${prefix}.${key}` : key;
        result.push({ path: pathStr, value });
      }
    }
  }
  return result;
}

// Función para convertir la ruta en columnas
function pathToColumns(flatData) {
  const rows = [];
  
  // Encontrar el máximo número de niveles
  let maxDepth = 0;
  flatData.forEach(item => {
    const depth = item.path.split('.').length;
    if (depth > maxDepth) maxDepth = depth;
  });
  
  // Crear encabezados
  const headers = [];
  for (let i = 1; i <= maxDepth; i++) {
    headers.push(`Level ${i}`);
  }
  headers.push('Value');
  rows.push(headers);
  
  // Crear filas
  flatData.forEach(item => {
    const parts = item.path.split('.');
    const row = new Array(maxDepth).fill('');
    
    parts.forEach((part, index) => {
      row[index] = part;
    });
    
    row.push(item.value);
    rows.push(row);
  });
  
  return rows;
}

// Función para escapar valores CSV
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const stringValue = String(value);
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

// Función para convertir a CSV
function toCSV(rows) {
  return rows.map(row => 
    row.map(cell => escapeCSV(cell)).join(',')
  ).join('\n');
}

// Cargar el archivo de traducciones
const translationsPath = path.join(__dirname, 'src', 'webparts', 'facultyTasks', 'loc', 'en-us.js');
const outputPath = path.join(__dirname, 'translations_en-us.csv');

console.log(`📂 Leyendo archivo: ${translationsPath}`);

// Leer el archivo
const content = fs.readFileSync(translationsPath, 'utf8');

// Intentar extraer el objeto con diferentes patrones
let translations = null;

// Patrón 1: define con return
let defineRegex = /define\s*\(\s*\[\s*\]\s*,\s*function\s*\(\s*\)\s*\{[\s\S]*return\s*(\{[\s\S]*\})\s*;?\s*\}\s*\)/;
let match = content.match(defineRegex);

if (!match) {
  // Patrón 2: solo buscar el return con el objeto
  defineRegex = /return\s*(\{[\s\S]*\})\s*;?\s*\}\s*\)/;
  match = content.match(defineRegex);
}

if (match) {
  console.log('✓ Patrón encontrado, extrayendo objeto...');
  const objString = match[1];
  
  try {
    // Evaluar el objeto de forma segura
    translations = eval(`(${objString})`);
    console.log('✓ Objeto extraído correctamente');
  } catch (error) {
    console.error('❌ Error al evaluar el objeto:', error.message);
    process.exit(1);
  }
  
  // Aplanar el objeto
  const flatData = flattenObject(translations);
  console.log(`✓ Objeto aplanado: ${flatData.length} traducciones encontradas`);
  
  // Convertir a formato de columnas
  const rows = pathToColumns(flatData);
  
  // Convertir a CSV
  const csv = toCSV(rows);
  
  // Guardar el archivo
  fs.writeFileSync(outputPath, csv, 'utf8');
  
  console.log(`✅ Archivo CSV generado: ${outputPath}`);
  console.log(`Total de traducciones: ${flatData.length}`);
} else {
  console.error('❌ No se pudo extraer el objeto de traducciones');
  console.log('\n📋 Primeras 500 caracteres del archivo:');
  console.log(content.substring(0, 500));
}