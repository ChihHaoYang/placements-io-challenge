import { Text, type TextProps, Tooltip } from '@mantine/core'
import { memo } from 'react'
import CountUp from 'react-countup'

interface AnimatedNumberProps extends TextProps {
  value: number
  compact?: boolean
  prefix?: string
}

export const AnimatedNumber = memo(function AnimatedNumber({
  value,
  prefix = '',
  compact,
  style,
  ...props
}: AnimatedNumberProps) {
  if (compact) {
    return (
      <Tooltip label={`$ ${value.toLocaleString()}`} withArrow position="top-end">
        <Text
          {...props}
          style={{
            ...style,
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
            cursor: 'help'
          }}
        >
          <CountUp
            start={undefined}
            end={value}
            duration={1.5}
            preserveValue={true}
            formattingFn={(val) =>
              Intl.NumberFormat('en-US', {
                notation: 'compact',
                compactDisplay: 'short',
                maximumFractionDigits: 2,
                style: 'currency',
                currency: 'USD'
              }).format(val)
            }
          />
        </Text>
      </Tooltip>
    )
  }
  return (
    <Text
      {...props}
      style={{
        ...style,
        fontVariantNumeric: 'tabular-nums',
        fontFeatureSettings: '"tnum"'
      }}
    >
      <CountUp
        start={undefined}
        end={value}
        duration={1.5}
        separator=","
        decimals={2}
        decimal="."
        prefix={prefix}
        preserveValue={true}
      />
    </Text>
  )
})
