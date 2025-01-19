import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import testIDs from '../testIDs';

export default function TabTwoScreen() {
  const [items, setItems] = useState<AgendaSchedule>({});

  const loadItems = (day: DateData) => {
    const newItems = { ...items };

    setTimeout(() => {
      for (let i = -15; i < 85; i++) {
        const time = day.timestamp + i * 24 * 60 * 60 * 1000;
        const strTime = timeToString(time);

        // Randomly decide whether to add records for this day
        if (Math.random() > 0.3) { // 70% chance to add records
          if (!newItems[strTime]) {
            newItems[strTime] = [];

            const numItems = Math.floor(Math.random() * 3 + 1);
            for (let j = 0; j < numItems; j++) {
              newItems[strTime].push({
                name: 'Item for ' + strTime + ' #' + j,
                height: Math.max(50, Math.floor(Math.random() * 150)),
                day: strTime
              });
            }
          }
        }
      }
      console.log("newItems length - ", newItems.length);
      setItems(newItems);
    }, 1000);
  };

  const renderDay = (day) => {
    if (day) {
      return <Text style={styles.customDay}>{day.getDay()}</Text>;
    }
    return <View style={styles.dayItem} />;
  };

  const renderItem = (reservation: AgendaEntry, isFirst: boolean) => {
    const fontSize = isFirst ? 16 : 16;
    const color = isFirst ? 'black' : '#43515c';

    return (
      <TouchableOpacity
        testID={testIDs.agenda.ITEM}
        // style={[styles.item, { height: reservation.height }]}
        style={[styles.item]}
        onPress={() => Alert.alert(reservation.name)}>
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const timeToString = (time: number) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };

  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={loadItems}
      selected={currentDate.toISOString().split('T')[0]}
      renderItem={renderItem}
      renderEmptyDate={renderEmptyDate}
      rowHasChanged={rowHasChanged}
      showClosingKnob={true}
      minDate={minDate.toISOString().split('T')[0]}
      maxDate={maxDate.toISOString().split('T')[0]}
    />
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: 'white',
    flex: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
    marginTop: 17
  },
  emptyDate: {
    height: 15,
    flex: 1,
    paddingTop: 30
  },
  customDay: {
    margin: 10,
    fontSize: 24,
    color: 'green'
  },
  dayItem: {
    marginLeft: 34
  }
});