package com.tiles.server;

public class Terrain {
    
    private String key;
    private String description;
    private boolean blocking;
    private boolean useable;

    //constructor
    public Terrain(String newKey, String newDesc, boolean newBlock, boolean newUse) {
        this.key = newKey;
        this.description = newDesc;
        this.blocking = newBlock;
        this.useable = newUse;
    }

    // Getters
    public String getKey() { return key; }
    public String getDesc() { return description; }
    public boolean isBlocking() { return blocking; }
    public boolean isUseable() {return useable; }
    
}
