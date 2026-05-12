package com.tiles.server;

public class PlayerData {
    private String username;
    private String encPass; //do we need to store this here because we already have the AccountDetails
                            //if we are going to store, can just look up from AccountDetails
    private int characterIcon; //not sure how we will do this but int for now
    private int xPos;
    private int yPos;
    //will need an inventory as well -- maybe an array of Item (make class) objects

    public PlayerData(String name) {
        this.username = name;
    }

    public String getUsername() {
        return this.username;
    }

    //TODO
    //methods for accessing PlayerData attributes
}
