package com.tiles.server;

import java.util.ArrayList;
import java.util.Optional;

public class PlayerData {
    
    private String username;
    private String encPass; //do we need to store this here because we already have the AccountDetails
                            //if we are going to store, can just look up from AccountDetails
    private int characterIcon; //not sure how we will do this but int for now
    private int xPos;
    private int yPos;

    private Boolean spawned;

    private ArrayList<Item> inventory = new ArrayList<Item>();
    private static final int maxItems = 3;

    public PlayerData(String name) {
        this.username = name;

        //Setting Default start position
        //will change to 5 when window reset is working -- right now takes value from info query
        //Is currently 100 to avoid Integer wrapping
        xPos = 5; 
        yPos = 5;

        characterIcon = asciiSum(name) % 10; //default just for testing

        spawned = false;
    }

    public String getUsername() {
        return this.username;
    }

    public boolean getSpawned() {
        return this.spawned;
    }

    public void hasSpawned() {
        this.spawned = true;
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

    public boolean inventoryFull() {

        if(this.inventory.size()==maxItems) {
            return true;
        } else {
            return false;
        }

    }

    public boolean inventoryEmpty() {

      return this.inventory.isEmpty();
        
    }

    public Optional<Item> storeItem (Item item) {

        //Check if there is already an identical item class stored
        for (int i = 0; i < this.inventory.size(); i++ ) {

            if(item.getType().equals(this.inventory.get(i).getType())) {
                
                //Effect swap
                Item drop = this.inventory.get(i);
                this.inventory.remove(i);

                this.inventory.add(item);

                return Optional.of(drop);

            } 

        }

        //Otherwise, if there is room and no identical item class already stored:
        this.inventory.add(item);
        return Optional.empty();

    }

    public Item removeItem() {

        //Remove last item from inventory:
        Item drop = this.inventory.getLast();
        this.inventory.removeLast();
        return drop;
        
    }

    public boolean hasItem(Item item) {
        
        return this.inventory.contains(item);
        
    }

}
