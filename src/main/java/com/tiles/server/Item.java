package com.tiles.server;

public class Item {
    
    private String ID;
    private String description;
    private String type;

    //constructor
    public Item(String newID, String newDesc, String newType) {
        this.ID = newID;
        this.description = newDesc;
        this.type = newType;
    }

    // Getters
    public String getID() { return ID; }
    public String getDesc() { return description; }
    public String getType() { return type; }
    
}
