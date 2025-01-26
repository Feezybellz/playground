# Define the deck of cards
cards = [('2', 'Hearts'), ('Ace', 'Spades'), ('10', 'Clubs'), ('Jack', 'Diamonds'), 
         ('King', 'Hearts'), ('3', 'Spades'), ('7', 'Clubs')]

# Define the rank order
rank_order = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']

# Define the suit order
suit_order = ['Clubs', 'Diamonds', 'Hearts', 'Spades']

# Sorting function based on rank and suit
def card_sort_key(card):
    # print(card)
    rank, suit = card
    # print(rank, suit)
    print(rank_order.index(rank), suit_order.index(suit))

    return (rank_order.index(rank), suit_order.index(suit))

# Sort the cards using the custom sorting key
sorted_cards = sorted(cards, key=card_sort_key)

# Print the sorted cards
print(sorted_cards)
