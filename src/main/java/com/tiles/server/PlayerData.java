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

        //Setting Default start position
        //will change to 5 when window reset is working -- right now takes value from info query
        //Is currently 100 to avoid Integer wrapping
        xPos = 100; 
        yPos = 100;

        characterIcon = asciiSum(name) % 10; //default just for testing
    }

    public String getUsername() {
        return this.username;
    }

    public int getX() {
        return this.xPos;
    }
    
    public int getY() {
        return this.yPos;
    }

    public int getIcon() {
        return this.characterIcon;
    }

    private int asciiSum(String name) {
        if (name.isEmpty()) {
            return 0;
        }

        return name.charAt(0) + asciiSum(name.substring(1));
    }

    public void setPos(int x, int y) {
        this.xPos = x;
        this.yPos = y;
    }

    

}
