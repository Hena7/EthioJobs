package com.ethiojobs.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class DatabaseRepairRunner implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseRepairRunner.class);
    private final JdbcTemplate jdbcTemplate;

    public DatabaseRepairRunner(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(String... args) {
        log.info("Running database repair checks for auth and role constraints...");
        try {
            // 1. Drop check constraint on users.role
            jdbcTemplate.execute(
                "DO $$ " +
                "DECLARE " +
                "    c_name text; " +
                "BEGIN " +
                "    FOR c_name IN " +
                "        SELECT conname " +
                "        FROM pg_constraint con " +
                "        JOIN pg_class rel ON rel.oid = con.conrelid " +
                "        JOIN pg_attribute att ON att.attnum = ANY(con.conkey) AND att.attrelid = con.conrelid " +
                "        WHERE rel.relname = 'users' AND att.attname = 'role' AND con.contype = 'c' " +
                "    LOOP " +
                "        EXECUTE 'ALTER TABLE users DROP CONSTRAINT IF EXISTS ' || c_name || ' CASCADE'; " +
                "    END LOOP; " +
                "END $$;"
            );

            // 2. Add the correct check constraint for users.role
            jdbcTemplate.execute(
                "ALTER TABLE users ADD CONSTRAINT users_role_check " +
                "CHECK (role::text IN ('ADMIN', 'EMPLOYER', 'JOB_SEEKER', 'FREELANCER'));"
            );

            // 3. Drop unique constraints on refresh_tokens.user_id
            jdbcTemplate.execute(
                "DO $$ " +
                "DECLARE " +
                "    c_name text; " +
                "BEGIN " +
                "    FOR c_name IN " +
                "        SELECT conname " +
                "        FROM pg_constraint con " +
                "        JOIN pg_class rel ON rel.oid = con.conrelid " +
                "        JOIN pg_attribute att ON att.attnum = ANY(con.conkey) AND att.attrelid = con.conrelid " +
                "        WHERE rel.relname = 'refresh_tokens' AND att.attname = 'user_id' AND con.contype = 'u' " +
                "    LOOP " +
                "        EXECUTE 'ALTER TABLE refresh_tokens DROP CONSTRAINT IF EXISTS ' || c_name || ' CASCADE'; " +
                "    END LOOP; " +
                "END $$;"
            );

            // 4. Drop unique indexes on refresh_tokens.user_id
            jdbcTemplate.execute(
                "DO $$ " +
                "DECLARE " +
                "    i_name text; " +
                "BEGIN " +
                "    FOR i_name IN " +
                "        SELECT i.relname " +
                "        FROM pg_class t, pg_class i, pg_index ix, pg_attribute a " +
                "        WHERE t.oid = ix.indrelid " +
                "        AND i.oid = ix.indexrelid " +
                "        AND a.attrelid = t.oid " +
                "        AND a.attnum = ANY(ix.indkey) " +
                "        AND t.relkind = 'r' " +
                "        AND t.relname = 'refresh_tokens' " +
                "        AND a.attname = 'user_id' " +
                "        AND ix.indisunique = true " +
                "        AND ix.indisprimary = false " +
                "    LOOP " +
                "        EXECUTE 'DROP INDEX IF EXISTS ' || i_name || ' CASCADE'; " +
                "    END LOOP; " +
                "END $$;"
            );

            log.info("Database repair checks completed successfully.");
        } catch (Exception e) {
            log.warn("Database repair skipped or failed (expected if not using Postgres or running on empty schema): {}", e.getMessage());
        }
    }
}
