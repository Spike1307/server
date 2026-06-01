package com.tiles.server;

import java.util.ArrayList;
import java.util.Optional;

public class PlayerData {
    
    private String username;
    private int characterIcon; 
    private int xPos;
    private int yPos;

    private Boolean spawned;

    private ArrayList<Item> inventory = new ArrayList<Item>();
    private static final int maxItems = 3;

    public PlayerData(String name) {
        this.username = name;

        //Setting Default start position
        xPos = 5; 
        yPos = 5;

        characterIcon = asciiSum(name) % 10;

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

    public synchronized int getX() {
        return this.xPos;
    }
    
    public synchronized int getY() {
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

    public synchronized void setPos(int x, int y) {
        this.xPos = x;
        this.yPos = y;
    }

    public Optional<Item> storeItem (Item item) {

        //Check if there is room
        if(this.inventory.size()==maxItems) {
            return Optional.of(item); //Return to sender
        }

        //Check if there is already an identical item class stored
        for (int i = 0; i < this.inventory.size(); i++ ) {

            if(item.getType() == this.inventory.get(i).getType()) {
                
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

    public Optional<Item> removeItem() {

        //Check if inventory is empty
        if(this.inventory.size() == 0){
            return Optional.empty();
        }

        //If non-empty, remove last item from inventory:
        Item drop = this.inventory.getLast();
        this.inventory.removeLast();
        return Optional.of(drop);
        
    }

}
