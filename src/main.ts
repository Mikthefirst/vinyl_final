import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    const config = new DocumentBuilder()
        .setTitle('Vinyl Store API')
        .setDescription('API documentation for Vinyl Store application')
        .setVersion('1.0')
        .addTag('auth', 'Authentication endpoints')
        .addTag('users', 'User management endpoints')
        .addTag('vinyls', 'Vinyl records management')
        .addTag('reviews', 'Reviews management')
        .addTag('purchases', 'Purchase management')
        .addTag('profile', 'User profile management')
        .addTag('stripe', 'Payment processing')
        .addTag('audit', 'Audit logs (admin only)')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Enter JWT token',
                in: 'header'
            },
            'JWT-auth'
        )
        .addSecurityRequirements('JWT-auth')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document, {
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true
        },
        customSiteTitle: 'Vinyl Store API Docs',
        customCss: '.swagger-ui .topbar { display: none }'
    });
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            whitelist: true
        })
    );
    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
