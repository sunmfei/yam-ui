import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import HelloWorld from './HelloWorld.vue'

describe('HelloWorld', () => {
  it('renders properly', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.text()).toContain('Particles')
  })

  it('has ParticlesBg component', () => {
    const wrapper = mount(HelloWorld)
    expect(wrapper.findComponent({ name: 'ParticlesBg' }).exists()).toBe(true)
  })

  it('has correct container classes', () => {
    const wrapper = mount(HelloWorld)
    const container = wrapper.find('div')
    expect(container.exists()).toBe(true)
    expect(container.classes()).toContain('flex')
  })
})
