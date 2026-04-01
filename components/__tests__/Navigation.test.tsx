import React from 'react'
import { render, screen } from '@testing-library/react'
import Navigation from '../Navigation'

// Mock next/navigation
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

// Mock next/link
jest.mock('next/link', () => {
  return function MockLink({ children, href, ...props }: any) {
    return <a href={href} {...props}>{children}</a>
  }
})

describe('Navigation', () => {
  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks()
  })

  it('renders navigation with all nav items', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/')

    render(<Navigation />)

    // Check if all navigation items are rendered
    expect(screen.getByText('单元')).toBeInTheDocument()
    expect(screen.getByText('学习')).toBeInTheDocument()
    expect(screen.getByText('复习')).toBeInTheDocument()
    expect(screen.getByText('测试')).toBeInTheDocument()
    expect(screen.getByText('收藏')).toBeInTheDocument()
    expect(screen.getByText('统计')).toBeInTheDocument()
  })

  it('renders logo', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/')

    render(<Navigation />)

    expect(screen.getByText('VocabMaster')).toBeInTheDocument()
  })

  it('highlights active nav item', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/learn')

    render(<Navigation />)

    const learnLink = screen.getByText('学习').closest('a')
    expect(learnLink).toHaveClass('bg-gradient-to-r')
  })

  it('shows user streak info', () => {
    const { usePathname } = require('next/navigation')
    usePathname.mockReturnValue('/')

    render(<Navigation />)

    expect(screen.getByText('🔥 15天')).toBeInTheDocument()
  })
})
