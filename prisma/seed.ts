import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';


async function main() {
    const imagePath = path.join(__dirname, '../src/img');

    const dadosCategorias = [
        {
            categoria: "Carro",
            icon: "icon-carro.png"
        },
        {
            categoria: "Casa",
            icon: "icon-casa.png"
        },
        {
            categoria: "Lazer",
            icon: "icon-lazer.png"
        },
        {
            categoria: "Mercado",
            icon: "icon-mercado.png"
        },
        {
            categoria: "Educação",
            icon: "icon-treinamento.png"
        },
        {
            categoria: "Viagem",
            icon: "icon-viagem.png"
        }
    ];

    for (const item of dadosCategorias) {
        const imageBuffer = fs.readFileSync(path.join(imagePath, item.icon));

        const imageBase64 = imageBuffer.toString('base64');

        // Salva no banco de dados
        await prisma.categoria.create({
            data: {
                categoria: item.categoria,
                icon: imageBase64,
            },
        });
    }

    console.log('Seed concluído!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });