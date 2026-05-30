package com.tiles.server;

import java.io.IOException;
import java.io.InputStreamReader;

import java.io.BufferedReader;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.regex.Matcher;
import java.util.stream.Collectors;
import java.util.Optional;

import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;

@Component
public class World {

    // Map dimensions
	private static final int MAP_WIDTH = 20;
	private static final int MAP_HEIGHT = 20;
    
    //Map to be loaded from text file
    private String[][] MAP = new String[MAP_HEIGHT][MAP_WIDTH];

    // Record to store the terrain details (second + third columns from terrain text file)
    public record tileInfo(String description, boolean blocking) {}

    // Record to store item details (second + third columns from items text file)
    //public record itemInfo(String description, String type) {}

    private Map<String, tileInfo> terrains;
    private ArrayList<Item> items = new ArrayList<Item>();
    
    public World() {
       
        loadMap();
        loadTerrainLegend();
        loadItems();

    }

    private void loadMap() {
            
        //Old approach:
        //Path mapPath = getFilePath("Map.txt");

        //Austin's approach:
        //InputStream is = resource.getInputStream();
        //String map = new String(is.readAllBytes(), StandardCharsets.UTF_8);

        ClassPathResource resource = new ClassPathResource("Map.txt"); 
        Pattern pattern = Pattern.compile("'([^']*)'"); //Take contents between each: ' ' 
    
        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            //MAP = Files.lines(mapPath)
            MAP = reader.lines()
                .map(String::trim)
                .filter(line -> !line.isEmpty()) // skip empty lines
                .filter(line -> line.matches("\\[.+\\],")) //matches general expected line structure
                .map(line -> parseLine(line, pattern))   
                .filter(parts -> parts.length == MAP_WIDTH) //Skip lines missing entries.
                .toArray(String[][]::new);

        } catch (IOException e) {

            throw new RuntimeException("Unable to load map file!", e);  

        }

        System.out.println("Map File:");
        Arrays.stream(MAP)
      		.map(Arrays::toString)
      		.forEach(System.out::println);

    }

    private void loadTerrainLegend() {

        //Old approach:
        //Path terrainsPath = getFilePath("Terrains.txt");
        //terrains = Files.lines(terrainsPath)
            
        //Austin's approach:
        //ClassPathResource resource = new ClassPathResource("Terrains.txt"); 
        //InputStream is = resource.getInputStream();
        //String terrainString = new String(is.readAllBytes(), StandardCharsets.UTF_8);

        ClassPathResource resource = new ClassPathResource("Terrains.txt"); 

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            terrains = reader.lines()
                .map(String::trim)
                .filter(line -> !line.isEmpty()) // skip empty lines
                .map(line -> line.split("\\s*\\|\\s*"))  //split regex handles '|' delimeter with optional padding on either side.
                .filter(parts -> parts.length == 3) //Skip lines missing entries.
                .collect(Collectors.toMap(
                        parts -> parts[0].substring(0,1), //single character key (as string)
                        parts -> new tileInfo(
                                parts[1], //Tile description
                                parts[2].equalsIgnoreCase("blocking") //true if "blocking", otherwise false
                        )));
        

        } catch (IOException e) {

            throw new RuntimeException("Unable to load terrain legend!", e);

        }
        
        System.out.println("Terrain key:");
        terrains.forEach((k, v) ->
                    System.out.println(k + " | " + v.description + " | " + v.blocking));

    }

    private void loadItems() {

        ClassPathResource resource = new ClassPathResource("Items.txt"); 

        try (BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8))) {

            items = reader.lines()
                .map(String::trim)
                .filter(line -> !line.isEmpty()) // skip empty lines
                .map(line -> line.split("\\s*\\|\\s*"))  //split regex handles '|' delimeter with optional padding on either side.
                .filter(parts -> parts.length == 3) //Skip lines missing entries.
                .map(parts -> new Item(parts[0], parts[1], parts[2]))
                .collect(Collectors.toCollection(ArrayList::new));

        } catch (IOException e) {

            throw new RuntimeException("Unable to load items list!", e);

        }
        
        System.out.println("Items list:");
        for(int i = 0; i < items.size(); i++) {
            System.out.println(items.get(i).getID() + " | " + items.get(i).getDesc() + " | " + items.get(i).getType());
        }

    }

    //Helper method, applies regex to load map
    private static String[] parseLine(String line, Pattern pattern) {

        Matcher matcher = pattern.matcher(line);
        ArrayList<String> tilesList = new ArrayList<>();

        while (matcher.find()) {
            tilesList.add(matcher.group(1));
        }

        return tilesList.toArray(new String[tilesList.size()]);

    }

    //Deprecated, method didnt work in prod container - DS
    /* 
    private Path getFilePath(String asset) throws IOException {

        ClassPathResource resource = new ClassPathResource(asset);
        File file = resource.getFile();
        String absolutePath = file.getAbsolutePath();
        return Paths.get(absolutePath);

    }
    */
    
    public String[][] getMap() {
        return this.MAP;
    }

    public String getTile(int Y, int X) {
        return this.MAP[Y][X];
    }

    public void drawIcon(int Y, int X, int icon){
        String tile = getTile(Y,X) + icon;
        this.MAP[Y][X] = tile;
    }

     public void eraseIcon(int Y, int X, int icon){
        //replace instead of substring to not assume the player will alwas be the 
        //final char
        String tile = getTile(Y,X).replace(Integer.toString(icon), "");
        this.MAP[Y][X] = tile;
    }

    public Map<String, tileInfo> getTerrains() {
        return this.terrains;
    }

    public int getWidth() {
        return MAP_WIDTH;
    }
    
    public int getHeight() {
        return MAP_HEIGHT;
    }

    public Optional<Item> getItem(String ID) {
        
        for (Item item : this.items) {
            
            if (item.getID() == ID) {
                
                return Optional.of(item);

            }

        }

        return Optional.empty();

    }

    public tileInfo isBlocking(int Y, int X) {

        String tile = this.MAP[Y][X];
      
        //Check for unit tile
        if (tile.length() == 1) {
            return this.terrains.get(tile);
        } 
        
        //Check for bridge case
        if (tile.charAt(1) == 'b') {
            return this.terrains.get("b");
        }

        //Check for closed door case
        if (tile.charAt(1) == 'D') {
            return this.terrains.get("D");
        }

        return this.terrains.get(tile.substring(0,1));

    }

    //This is just to have something working with use
    //It may be better to have a generic is use method with an isUsable helper
    //would need to modify map data to account -- like blocking
    public void useDoor(int Y, int X){

        String tile = this.MAP[Y][X];

        if (tile.contains("D")) {
            this.MAP[Y][X] = tile.replace("D", "d");
        }
        
        if (tile.contains("d")) {
            this.MAP[Y][X] = tile.replace("d", "D");
        }

    }

    public boolean isDoor(int Y, int X) {

        String tile = this.MAP[Y][X];
        return tile.contains("D") || tile.contains("d");

    }

    public void take(int Y, int X, Item item) {
        
        String tile = this.MAP[Y][X];
        tile.replace(item.getID(), ""); //remove the item from the tile
        this.MAP[Y][X] = tile; //update map with removed item

    }

    public Optional<Item> containsItems(int Y, int X) {

        String tile = this.MAP[Y][X];

        //Check if an item already exists at this tile
        for (Item item : this.items) {
            
            if (tile.contains(item.getID())) {
                
                return Optional.of(item);

            }

        }

        //No items found
        return Optional.empty();

    }

    public void place(int Y, int X, Item item) {

        String tile = this.MAP[Y][X];
    
        //First check if there is player recorded at last character of tile string:
        String tileLastChar = tile.substring(tile.length()-1,tile.length()); //peration works with unit strings
        if (tileLastChar.matches("[0-9]")) { 

            //You can assume that if there is a player number present, the tile string contains at least 2 chars
            tile = tile.substring(0,tile.length()-1) + item.getID() + tileLastChar;

        } else {

            tile = tile + item.getID();

        }

        this.MAP[Y][X] = tile; //update map with new item

    }

    /* - Deprecated, more trouble than it's worth - DS
    public String getTileDescription(int Y, int X) {

        return this.terrains.get(this.MAP[Y][X]).description;
    
    }
    */

}

//Austins approach:
 /*
        try {
            ClassPathResource resource = new ClassPathResource("AccountDetails.txt"); //loads the file from the classpath
            try (BufferedReader br = new BufferedReader(new InputStreamReader(resource.getInputStream()))) { //reads the file using BufferedReader
                String line;
                while ((line = br.readLine()) != null) {    //reads the file line by line until the end of the file is reached
                    System.out.println("Account details:");
                    System.out.println(line);
                    String[] parts = line.split(":"); //splits the line into two parts using ":" as the delimiter, where parts[0] is the username and parts[1] is the password
                    if (parts.length == 2) {
                        map.put(parts[0].trim(), parts[1].trim());  //splits the line into username and password and stores in map
                        System.out.println("Acc: " +parts[0]);
                        System.out.println("PW: " + parts[1]);
                    }
                }
            }
        } catch (IOException e) {
            System.err.println("Error: " + e.getMessage());
        }
         */
