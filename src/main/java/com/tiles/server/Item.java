package com.tiles.server;

public class Item {
    
    private String ID;
    private String description;
    private String type;
    private int spawnX;
    private int spawnY;


    //constructor
    public Item(String newID, String newDesc, String newType, int newSpawnY, int newSpawnX) {
        this.ID = newID;
        this.description = newDesc;
        this.type = newType;
        this.spawnY = newSpawnY;
        this.spawnX = newSpawnX;
    }

    // Getters
    public String getID() { return ID; }
    public String getDesc() { return description; }
    public String getType() { return type; }
    public int getSpawnX() { return spawnX; }
    public int getSpawnY() { return spawnY; }

}
