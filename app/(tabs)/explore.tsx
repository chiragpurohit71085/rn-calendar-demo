import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Agenda, DateData, AgendaEntry, AgendaSchedule } from 'react-native-calendars';
import testIDs from '../testIDs';

const staticData = {
  "auctions": [
    {
      "id": "3200",
      "name": " The Inner Circle, A Napa Local's Collection, New York, October 7 - October 20",
      "type": "Live",
      "status": "STARTED",
      "lotCount": 1,
      "startDate": "2025-01-31T17:24:04+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/3200"
    },
    {
      "id": "3171",
      "name": " REPORTING TEST LIVE SALE",
      "type": "Live",
      "status": "STARTED",
      "lotCount": 9,
      "startDate": "2025-01-18T20:13:58+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/3171"
    },
    {
      "id": "3165",
      "name": "Fine & Rare Wines & Spirits, New York, June 28",
      "type": "Live",
      "status": "STARTED",
      "lotCount": 9,
      "startDate": "2024-12-17T07:24:27+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/3165"
    },
    {
      "id": "3152",
      "name": "REPORTING TEST TIMED SALE",
      "type": "Timed",
      "status": "STARTED",
      "lotCount": 10,
      "startDate": "2025-01-13T06:38:19+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/3152"
    },
    {
      "id": "3143",
      "name": "Hong Kong Live Admin Test Sale - September 2024",
      "type": "Live",
      "status": "STARTED",
      "lotCount": 10,
      "startDate": "2025-01-03T09:31:10+00:00",
      "endDate": "2025-01-06T09:31:10+00:00",
      "url": "http://sam.local/auctions/catalog/id/3143"
    },
    {
      "id": "3093",
      "name": "PSA UAT - A Winemaker's Cellar and Fine & Rare Wines & Spirits",
      "type": "Timed",
      "status": "STARTED",
      "lotCount": 4,
      "startDate": "2025-01-27T22:12:48+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/3093"
    },
    {
      "id": "3055",
      "name": " PSA UAT - Fine & Rare Wines & Spirits, Hong Kong, December 1 & 2",
      "type": "Live",
      "status": "STARTED",
      "lotCount": 0,
      "startDate": "2024-12-01T10:01:56+00:00",
      "url": "http://sam.local/auctions/catalog/id/3055"
    },
    {
      "id": "2975",
      "name": " FREYES TEST PSA UAT - Fine & Rare Wines & Spirits, Hong Kong, December 1 & 2",
      "type": "Hybrid",
      "status": "STARTED",
      "lotCount": 0,
      "startDate": "2024-12-01T10:01:56+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/2975"
    },
    {
      "id": "2964",
      "name": " post-auction import test",
      "type": "Hybrid",
      "status": "STARTED",
      "lotCount": 10,
      "startDate": "2025-01-26T23:15:11+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/2964"
    },
    {
      "id": "5883",
      "name": "Fine & Rare Wines & Spirits, Hong Kong, May 14",
      "type": "Hybrid",
      "status": "STARTED",
      "lotCount": 21,
      "startDate": "2025-01-22T06:03:49+00:00",
      "endDate": null,
      "url": "http://sam.local/auctions/catalog/id/5883"
    }
  ]
};

export default function TabTwoScreen() {
  const [items, setItems] = useState<AgendaSchedule>({});
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [markedDates, setMarkedDates] = useState<{ [key: string]: { marked?: boolean; disabled?: boolean } }>({});

  useEffect(() => {
    const newItems: AgendaSchedule = {};
    const newMarkedDates: { [key: string]: { marked?: boolean; disabled?: boolean } } = {};

    staticData.auctions.forEach(auction => {
      const strTime = auction.startDate.split('T')[0];
      if (!newItems[strTime]) {
        newItems[strTime] = [];
      }
      newItems[strTime].push({
        name: auction.name,
        height: 50,
        day: strTime
      });
      newMarkedDates[strTime] = { marked: true };
    });

    // Mark dates without events as disabled
    const currentDate = new Date();
    const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);
    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
      const dateString = d.toISOString().split('T')[0];
      if (!newMarkedDates[dateString]) {
        newMarkedDates[dateString] = { disabled: true };
      }
    }
    setItems(newItems);
    setMarkedDates(newMarkedDates);
  }, []);

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
        style={[styles.item]}
        onPress={() => Alert.alert(reservation.name)}>
        <Text style={{ fontSize, color }}>{reservation.name}</Text>
      </TouchableOpacity>
    );
  };

  const renderEmptyDate = () => {
    console.log('renderEmptyDate');
    return (
      <View style={styles.emptyDate}>
        <Text>This is empty date!</Text>
      </View>
    );
  };

  const rowHasChanged = (r1: AgendaEntry, r2: AgendaEntry) => {
    return r1.name !== r2.name;
  };

  const handleDayPress = (day) => {
    if (markedDates[day.dateString] && markedDates[day.dateString].disabled) {
      return; // Do nothing if the date is disabled
    }
    setSelectedDate(day.dateString);
  };

  const currentDate = new Date();
  const minDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
  const maxDate = new Date(currentDate.getFullYear() + 1, currentDate.getMonth(), 1);

  return (
    <Agenda
      testID={testIDs.agenda.CONTAINER}
      items={items}
      loadItemsForMonth={() => { }}
      selected={currentDate.toISOString().split('T')[0]}
      renderItem={renderItem}
      renderEmptyData={() => {
        return renderEmptyDate();
      }}
      onDayPress={(day) => setSelectedDate(day.dateString)}
      // onDayPress={handleDayPress}
      rowHasChanged={rowHasChanged}
      showOnlySelectedDayItems={false}
      showClosingKnob={true}
      minDate={minDate.toISOString().split('T')[0]}
      maxDate={maxDate.toISOString().split('T')[0]}
    // markedDates={markedDates}
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