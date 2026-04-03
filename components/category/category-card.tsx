import { useColors } from '@/hooks/colors'
import { useVisual } from '@/hooks/visuals/visual'
import { CategoryJson } from '@/lib/categories/type'
import { BlurTargetView, BlurView } from 'expo-blur'
import { router } from 'expo-router'
import { useRef } from 'react'
import { Image, Pressable, StyleSheet, View, ViewProps } from 'react-native'
import Animated from 'react-native-reanimated'
import { UiText } from '../ui/text'

export interface CategoryCardProps extends ViewProps {
  category: CategoryJson
}

export function CategoryCard({ category, style, ...props }: CategoryCardProps) {
  const targetRef = useRef<View | null>(null)
  const visual = useVisual(category.visualId)
  const colors = useColors()

  return (
    <View
      style={[
        {
          height: 80,
          width: 160,
          borderRadius: 12,
          overflow: 'hidden',
        },
        style,
      ]}
      {...props}>
      <BlurTargetView
        ref={targetRef}
        style={{
          flex: 1,
          flexWrap: 'wrap',
          ...StyleSheet.absoluteFill,
        }}>
        <Image
          source={{ uri: visual?.url }}
          style={{ flex: 1 }}
          width={1024}
          height={1024}
        />
      </BlurTargetView>
      <BlurView
        blurTarget={targetRef}
        intensity={100}
        tint={colors.theme}
        style={{
          flex: 1,
        }}
        blurMethod='dimezisBlurView'>
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => {
              router.navigate({
                pathname: '/search/[categoryId]',
                params: { categoryId: category.id },
              })
            }}>
            {({ pressed }) => (
              <Animated.View
                style={[
                  {
                    flexDirection: 'row',
                    height: 80,
                    paddingLeft: 16,
                    paddingRight: 16,
                    paddingVertical: 16,
                    gap: 16,
                    transition: 'all 100ms',
                  },
                  pressed && {
                    backgroundColor: colors.hoverBackground,
                    borderRadius: 8,
                  },
                ]}>
                <View
                  style={{
                    flexDirection: 'column',
                    gap: 4,
                    justifyContent: 'center',
                    flex: 1,
                  }}>
                  <UiText style={{ fontSize: 16 }} numberOfLines={2}>
                    {category.title}
                  </UiText>
                </View>
              </Animated.View>
            )}
          </Pressable>
        </View>
      </BlurView>
    </View>
  )
}
