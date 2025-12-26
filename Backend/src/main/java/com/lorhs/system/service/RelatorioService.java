package com.lorhs.system.service;

import com.lorhs.system.model.Funcionario;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

@Service
public class RelatorioService {

    public ByteArrayInputStream gerarExcelFuncionarios(List<Funcionario> funcionarios) {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {

            Sheet sheet = workbook.createSheet("Colaboradores");

            // Estilo
            CellStyle headerStyle = workbook.createCellStyle();
            Font font = workbook.createFont();
            font.setBold(true);
            headerStyle.setFont(font);
            headerStyle.setFillForegroundColor(IndexedColors.GREY_25_PERCENT.getIndex());
            headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);

            // Cabeçalho
            Row headerRow = sheet.createRow(0);
            String[] colunas = {"ID", "Nome", "Email", "CPF", "Data Admissão", "Setor", "Cargo", "Status"};

            for (int i = 0; i < colunas.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(colunas[i]);
                cell.setCellStyle(headerStyle);
            }

            // Dados
            int rowIdx = 1;
            for (Funcionario func : funcionarios) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(func.getId());
                row.createCell(1).setCellValue(func.getNome());
                row.createCell(2).setCellValue(func.getEmail());
                row.createCell(3).setCellValue(func.getCpf());

                // Tratamento de nulos para não quebrar o Excel
                row.createCell(4).setCellValue(func.getDataAdmissao() != null ? func.getDataAdmissao().toString() : "");
                row.createCell(5).setCellValue(func.getSetor() != null ? func.getSetor().getNome() : "");
                row.createCell(6).setCellValue(func.getCargo() != null ? func.getCargo().getNome() : "");

                // Status Ativo/Inativo
                row.createCell(7).setCellValue(func.getAtivo() != null && func.getAtivo() ? "Ativo" : "Inativo");
            }

            // Ajusta tamanho das colunas
            for(int i = 0; i < colunas.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());

        } catch (IOException e) {
            throw new RuntimeException("Erro ao gerar Excel: " + e.getMessage());
        }
    }
}