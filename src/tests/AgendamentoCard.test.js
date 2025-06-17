// Em src/components/AgendamentoCard.test.js

import React from 'react';
import { render } from '@testing-library/react-native';
import AgendamentoCard from '../components/AgendamentoCard';

describe('Componente AgendamentoCard', () => {

    it('deve renderizar o status "Aprovado" corretamente', () => {
        const mockAgendamento = {
            id: '123',
            dataAgendamento: '2025-12-25',
            status: 'ATIVO',
        };

        const { getByText, queryByText } = render(<AgendamentoCard agendamento={mockAgendamento} />);

        const statusText = getByText('Aprovado');
        expect(statusText).toBeTruthy();

        const outroStatusText = queryByText('Em Análise');
        expect(outroStatusText).toBeNull();
    });

});