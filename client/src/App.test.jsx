import React from 'react'
import {render, screen} from '@testing-library/react'
import {MemoryRouter} from 'react-router-dom'
import {App} from '@vzhyhunou/vzh-cms'

import config from './config';

const renderWithHistory = (route = '/') => render(
    <MemoryRouter initialEntries={[route]}>
        <App {...{config}}/>
    </MemoryRouter>
)

describe('App', () => {

    it('should render home page', async () => {
        renderWithHistory()
        expect(await screen.findByText('Sample page 1')).toBeDefined()
        expect(await screen.findByText('Home page')).toBeDefined()
        expect(document.title).toEqual('Home page')
    })

    it('should render login page', async () => {
        renderWithHistory('/login')
        expect(await screen.findByText('Sign in')).toBeDefined()
    })
})
