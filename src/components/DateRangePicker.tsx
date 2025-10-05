'use client';

import { useState } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { Group, Button, Popover, Stack, Text } from '@mantine/core';
import { IconCalendar, IconX } from '@tabler/icons-react';
import dayjs from 'dayjs';

interface DateRangePickerProps {
  value: [Date | null, Date | null];
  onChange: (value: [Date | null, Date | null]) => void;
  label?: string;
  placeholder?: string;
  clearable?: boolean;
}

export function DateRangePicker({ 
  value, 
  onChange, 
  label = "Tarih Aralığı",
  placeholder = "Tarih seçin",
  clearable = true 
}: DateRangePickerProps) {
  const [opened, setOpened] = useState(false);

  const quickRanges = [
    {
      label: 'Bugün',
      getValue: () => [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()] as [Date, Date]
    },
    {
      label: 'Dün',
      getValue: () => [
        dayjs().subtract(1, 'day').startOf('day').toDate(),
        dayjs().subtract(1, 'day').endOf('day').toDate()
      ] as [Date, Date]
    },
    {
      label: 'Son 7 Gün',
      getValue: () => [
        dayjs().subtract(7, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate()
      ] as [Date, Date]
    },
    {
      label: 'Son 30 Gün',
      getValue: () => [
        dayjs().subtract(30, 'day').startOf('day').toDate(),
        dayjs().endOf('day').toDate()
      ] as [Date, Date]
    },
    {
      label: 'Bu Ay',
      getValue: () => [
        dayjs().startOf('month').toDate(),
        dayjs().endOf('month').toDate()
      ] as [Date, Date]
    },
    {
      label: 'Geçen Ay',
      getValue: () => [
        dayjs().subtract(1, 'month').startOf('month').toDate(),
        dayjs().subtract(1, 'month').endOf('month').toDate()
      ] as [Date, Date]
    }
  ];

  const handleQuickSelect = (getValue: () => [Date, Date]) => {
    onChange(getValue());
    setOpened(false);
  };

  const handleClear = () => {
    onChange([null, null]);
  };

  return (
    <Group gap="xs" align="flex-end">
      <Popover 
        opened={opened} 
        onChange={setOpened} 
        position="bottom-start" 
        width={300}
        shadow="md"
      >
        <Popover.Target>
          <div style={{ flex: 1 }}>
            <DatePickerInput
              type="range"
              label={label}
              placeholder={placeholder}
              value={value}
              onChange={onChange}
              leftSection={<IconCalendar size={16} />}
              valueFormat="DD/MM/YYYY"
              clearable={clearable}
              onClick={() => setOpened(true)}
              locale="tr"
            />
          </div>
        </Popover.Target>
        
        <Popover.Dropdown>
          <Stack gap="xs">
            <Text size="sm" fw={600} c="dimmed">Hızlı Seçim</Text>
            {quickRanges.map((range) => (
              <Button
                key={range.label}
                variant="light"
                size="xs"
                fullWidth
                onClick={() => handleQuickSelect(range.getValue)}
              >
                {range.label}
              </Button>
            ))}
          </Stack>
        </Popover.Dropdown>
      </Popover>

      {clearable && (value[0] || value[1]) && (
        <Button
          variant="subtle"
          color="gray"
          size="sm"
          onClick={handleClear}
          leftSection={<IconX size={14} />}
        >
          Temizle
        </Button>
      )}
    </Group>
  );
}

