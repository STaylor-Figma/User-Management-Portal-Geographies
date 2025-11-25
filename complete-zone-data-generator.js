/**
 * COMPLETE ZONE DATA GENERATOR
 * Processes CSV data into comprehensive JavaScript data structure
 * 
 * This file generates complete zone data from the CSV files for use in wireframes
 */

const fs = require('fs');
const path = require('path');

// Function to read and parse CSV file
function parseCSV(filePath) {
    const csvContent = fs.readFileSync(filePath, 'utf8');
    const lines = csvContent.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, index) => {
            obj[header] = values[index];
        });
        return obj;
    });
}

// Process the main CSV data
console.log('Processing MarketZone_to_county_map.csv...');
const csvData = parseCSV('./MarketZone_to_county_map.csv');

// Group data by zones
const zoneMap = new Map();
const countyData = [];

csvData.forEach(row => {
    const zoneId = parseInt(row.FeatureID);
    const zoneName = row.FeatureName;
    const countyName = row.CountyName;
    const countyFIPS = row.CountyFIPS;
    const state = row.StateOrProvinceCode;
    
    if (!zoneMap.has(zoneId)) {
        zoneMap.set(zoneId, {
            id: zoneId,
            name: zoneName,
            counties: [],
            states: new Set()
        });
    }
    
    const zone = zoneMap.get(zoneId);
    zone.counties.push({
        name: countyName,
        fips: countyFIPS,
        state: state
    });
    zone.states.add(state);
});

// Convert to final data structure
const zones = Array.from(zoneMap.values()).map(zone => ({
    id: zone.id,
    name: zone.name,
    states: Array.from(zone.states),
    countyCount: zone.counties.length,
    counties: zone.counties
}));

// Sort zones by name for better organization
zones.sort((a, b) => a.name.localeCompare(b.name));

// Generate the complete JavaScript file
const jsContent = `/**
 * COMPLETE MARKET ZONE & COUNTY DATA
 * Generated from CSV data - ${new Date().toISOString()}
 * 
 * Contains all ${zones.length} Market Zones with complete county lists
 * Total counties: ${zones.reduce((sum, zone) => sum + zone.countyCount, 0)}
 * 
 * USAGE:
 * 1. Include this file in your HTML: <script src="complete-zone-data.js"></script>
 * 2. Access data via: COMPLETE_ZONE_DATA.zones
 * 3. Search zones: COMPLETE_ZONE_DATA.findZone(name)
 * 4. Get zone counties: COMPLETE_ZONE_DATA.getZoneCounties(zoneId)
 */

const COMPLETE_ZONE_DATA = {
    // All zones with complete data
    zones: ${JSON.stringify(zones, null, 2)},
    
    // Helper functions
    findZone: function(name) {
        return this.zones.find(zone => 
            zone.name.toLowerCase().includes(name.toLowerCase())
        );
    },
    
    getZoneCounties: function(zoneId) {
        const zone = this.zones.find(z => z.id === zoneId);
        return zone ? zone.counties : [];
    },
    
    getZonesByState: function(stateCode) {
        return this.zones.filter(zone => 
            zone.states.includes(stateCode.toUpperCase())
        );
    },
    
    getAllStates: function() {
        const states = new Set();
        this.zones.forEach(zone => {
            zone.states.forEach(state => states.add(state));
        });
        return Array.from(states).sort();
    },
    
    // Statistics
    getTotalCounties: function() {
        return this.zones.reduce((sum, zone) => sum + zone.countyCount, 0);
    },
    
    getZoneCount: function() {
        return this.zones.length;
    }
};

// Make it work in both browser and Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = COMPLETE_ZONE_DATA;
}
`;

// Write the complete data file
fs.writeFileSync('./complete-zone-data.js', jsContent);

console.log(`✅ Generated complete-zone-data.js with:`);
console.log(`   - ${zones.length} zones`);
console.log(`   - ${zones.reduce((sum, zone) => sum + zone.countyCount, 0)} total counties`);
console.log(`   - ${new Set(zones.flatMap(z => z.states)).size} states/territories`);

// Generate summary for preview
const summary = zones.slice(0, 10).map(zone => ({
    name: zone.name,
    states: zone.states,
    countyCount: zone.countyCount
}));

console.log('\\nFirst 10 zones preview:');
console.table(summary);